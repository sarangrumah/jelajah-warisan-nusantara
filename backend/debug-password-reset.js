// Debug password reset process
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

async function debugPasswordReset() {
  try {
    console.log('🔍 Debugging password reset process...');
    
    // Get all password reset tokens
    const tokensResult = await pool.query(`
      SELECT token, user_id, expires_at, used, created_at
      FROM password_reset_tokens 
      ORDER BY created_at DESC
    `);
    
    console.log(`📊 Found ${tokensResult.rows.length} password reset tokens:`);
    tokensResult.rows.forEach((token, index) => {
      const now = new Date();
      const isExpired = new Date(token.expires_at) < now;
      console.log(`\nToken ${index + 1}:`);
      console.log(`  Token: ${token.token.substring(0, 10)}...`);
      console.log(`  User ID: ${token.user_id}`);
      console.log(`  Created: ${token.created_at}`);
      console.log(`  Expires: ${token.expires_at}`);
      console.log(`  Used: ${token.used}`);
      console.log(`  Status: ${isExpired ? '❌ EXPIRED' : token.used ? '✅ USED' : '⏳ ACTIVE'}`);
    });
    
    // Check if there are any active tokens
    const activeTokens = tokensResult.rows.filter(token => {
      const now = new Date();
      return new Date(token.expires_at) > now && !token.used;
    });
    
    console.log(`\n🔍 Active tokens: ${activeTokens.length}`);
    
    if (activeTokens.length > 0) {
      console.log('Testing password reset with active token...');
      
      const activeToken = activeTokens[0];
      const newPassword = 'TestResetPassword123!';
      
      // Simulate the resetPassword function logic
      console.log('\n🔧 Simulating resetPassword function...');
      
      // 1. Validate token (like validateResetToken)
      const tokenValidation = await pool.query(
        'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
        [activeToken.token]
      );
      
      if (tokenValidation.rows.length === 0) {
        console.log('❌ Token validation failed - token is invalid, expired, or already used');
        return;
      }
      
      console.log('✅ Token validation passed');
      const userId = tokenValidation.rows[0].user_id;
      
      // 2. Get user current password
      const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        console.log('❌ User not found');
        return;
      }
      
      const currentHash = userResult.rows[0].password_hash;
      console.log('✅ User found');
      
      // 3. Check if new password is same as current (like resetPassword does)
      const isSamePassword = await bcrypt.compare(newPassword, currentHash);
      if (isSamePassword) {
        console.log('❌ New password is same as current password');
        return;
      }
      console.log('✅ New password is different from current');
      
      // 4. Hash new password
      const newHash = await bcrypt.hash(newPassword, 12);
      console.log('✅ New password hashed');
      
      // 5. Update password in database
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);
      console.log('✅ Password updated in database');
      
      // 6. Mark token as used
      await pool.query('UPDATE password_reset_tokens SET used = true WHERE token = $1', [activeToken.token]);
      console.log('✅ Token marked as used');
      
      // 7. Test login with new password
      const loginTest = await pool.query(
        'SELECT password_hash FROM users WHERE id = $1', 
        [userId]
      );
      
      if (loginTest.rows.length > 0) {
        const loginHash = loginTest.rows[0].password_hash;
        const loginValid = await bcrypt.compare(newPassword, loginHash);
        console.log(`🔑 Login test with new password: ${loginValid ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        if (!loginValid) {
          console.log('❌ CRITICAL: Password update worked but login failed!');
          console.log('This suggests the password was not properly updated or there is a bcrypt issue.');
        }
      }
    } else {
      console.log('\n⚠️ No active tokens found. Creating a test token...');
      
      // Get a test user
      const userResult = await pool.query('SELECT id, email FROM users LIMIT 1');
      if (userResult.rows.length === 0) {
        console.log('❌ No users found');
        return;
      }
      
      const testUser = userResult.rows[0];
      console.log(`Using test user: ${testUser.email}`);
      
      // Generate a test token
      const testToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [testUser.id, testToken, expiresAt]
      );
      
      console.log(`✅ Created test token: ${testToken.substring(0, 10)}...`);
      console.log('You can now test the password reset flow with this token');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

debugPasswordReset();