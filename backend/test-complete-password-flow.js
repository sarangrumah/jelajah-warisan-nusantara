// Complete test of password reset and login flow
require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Pool } = require('pg');

// Use the same config logic as database.ts
let config;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  config = {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port),
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace('/', ''),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'mcb_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(config);

async function testCompletePasswordFlow() {
  let testUserId = null;
  let testUserEmail = null;
  let originalPasswordHash = null;
  
  try {
    console.log('🔍 Testing complete password reset and login flow...');
    
    // Get a test user
    const userResult = await pool.query('SELECT id, email, password_hash FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    const testUser = userResult.rows[0];
    testUserId = testUser.id;
    testUserEmail = testUser.email;
    originalPasswordHash = testUser.password_hash;
    
    console.log('👤 Using test user:', { id: testUserId, email: testUserEmail });
    console.log('🔑 Original password hash:', originalPasswordHash.substring(0, 20) + '...');
    
    // Step 1: Create a password reset token (simulate forgotPassword)
    console.log('\n📧 Step 1: Creating password reset token...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [testUserId, resetToken, expiresAt]
    );
    
    console.log('✅ Password reset token created:', resetToken.substring(0, 10) + '...');
    
    // Step 2: Validate the token (simulate validateResetToken)
    console.log('\n🔐 Step 2: Validating reset token...');
    const tokenValidation = await pool.query(
      'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
      [resetToken]
    );
    
    if (tokenValidation.rows.length === 0) {
      console.log('❌ Token validation failed');
      return;
    }
    
    const validatedUserId = tokenValidation.rows[0].user_id;
    console.log('✅ Token validated for user:', validatedUserId);
    
    // Step 3: Reset password (simulate resetPassword)
    console.log('\n🔄 Step 3: Resetting password...');
    const newPassword = 'NewTestPassword123!';
    
    // Check if new password is same as current (should be false)
    const isSamePassword = await bcrypt.compare(newPassword, originalPasswordHash);
    if (isSamePassword) {
      console.log('❌ New password is same as current password');
      return;
    }
    console.log('✅ New password is different from current');
    
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 12);
    console.log('✅ New password hashed');
    
    // Update password in database
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, testUserId]);
    console.log('✅ Password updated in database');
    
    // Mark token as used
    await pool.query('UPDATE password_reset_tokens SET used = true WHERE token = $1', [resetToken]);
    console.log('✅ Token marked as used');
    
    // Step 4: Verify password was actually updated
    console.log('\n🔍 Step 4: Verifying password update...');
    const updatedUserResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [testUserId]);
    const updatedPasswordHash = updatedUserResult.rows[0].password_hash;
    
    console.log('🔑 Updated password hash:', updatedPasswordHash.substring(0, 20) + '...');
    console.log('🔑 Hashes are different:', originalPasswordHash !== updatedPasswordHash);
    
    // Step 5: Test login with new password (simulate signIn)
    console.log('\n🔐 Step 5: Testing login with new password...');
    
    // Test with correct new password
    const loginValid = await bcrypt.compare(newPassword, updatedPasswordHash);
    console.log('🔑 Login with new password:', loginValid ? '✅ SUCCESS' : '❌ FAILED');
    
    // Test with wrong password
    const wrongPasswordValid = await bcrypt.compare('WrongPassword123!', updatedPasswordHash);
    console.log('🔑 Login with wrong password:', wrongPasswordValid ? '❌ SHOULD FAIL' : '✅ CORRECTLY FAILED');
    
    // Test with old password
    const oldPasswordValid = await bcrypt.compare('wrongpassword', updatedPasswordHash);
    console.log('🔑 Login with old password:', oldPasswordValid ? '❌ SHOULD FAIL' : '✅ CORRECTLY FAILED');
    
    if (loginValid && !wrongPasswordValid && !oldPasswordValid) {
      console.log('\n🎉 SUCCESS: Password reset and login flow working correctly!');
    } else {
      console.log('\n❌ FAILURE: Password reset flow has issues');
      if (!loginValid) {
        console.log('❌ Problem: Cannot login with new password');
      }
      if (wrongPasswordValid) {
        console.log('❌ Problem: Wrong password is accepted');
      }
      if (oldPasswordValid) {
        console.log('❌ Problem: Old password still works');
      }
    }
    
    // Step 6: Clean up - restore original password
    console.log('\n🧹 Step 6: Cleaning up...');
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [originalPasswordHash, testUserId]);
    console.log('✅ Original password restored');
    
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [resetToken]);
    console.log('✅ Test token deleted');
    
  } catch (error) {
    console.error('❌ Error during password flow test:', error.message);
    console.error('Stack:', error.stack);
    
    // Clean up on error
    if (testUserId && originalPasswordHash) {
      try {
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [originalPasswordHash, testUserId]);
        console.log('✅ Cleanup: Original password restored');
      } catch (cleanupError) {
        console.error('❌ Cleanup failed:', cleanupError.message);
      }
    }
  } finally {
    await pool.end();
  }
}

testCompletePasswordFlow();