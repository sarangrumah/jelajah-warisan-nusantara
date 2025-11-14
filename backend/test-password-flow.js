// Test the password reset and login flow
require('dotenv').config();
const bcrypt = require('bcryptjs');

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

async function testPasswordFlow() {
  try {
    console.log('🔍 Testing password reset and login flow...');
    
    // Get a test user
    const userResult = await pool.query('SELECT id, email, password_hash FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    const testUser = userResult.rows[0];
    console.log('👤 Test user:', { id: testUser.id, email: testUser.email });
    
    // Test password hashing and comparison
    const testPassword = 'TestPassword123!';
    console.log('🔑 Testing password hashing...');
    
    // Hash the password like the resetPassword function does
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    console.log('✅ Password hashed successfully');
    
    // Test comparison like the signIn function does
    const isValid = await bcrypt.compare(testPassword, hashedPassword);
    console.log('🔑 Password comparison test:', isValid ? '✅ PASS' : '❌ FAIL');
    
    if (!isValid) {
      console.log('❌ Password comparison failed! This is the root cause.');
      console.log('Original password:', testPassword);
      console.log('Hashed password:', hashedPassword);
    }
    
    // Test comparison with the user's current password hash
    const currentPasswordValid = await bcrypt.compare('wrongpassword', testUser.password_hash);
    console.log('🔑 Current password comparison (wrong password):', currentPasswordValid ? '✅ PASS' : '❌ FAIL (expected)');
    
    // Check if there are any issues with the password_reset_tokens
    const tokensResult = await pool.query(`
      SELECT token, user_id, expires_at, used 
      FROM password_reset_tokens 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    
    if (tokensResult.rows.length > 0) {
      const token = tokensResult.rows[0];
      console.log('🔑 Latest password reset token:', {
        token: token.token.substring(0, 10) + '...',
        user_id: token.user_id,
        expires_at: token.expires_at,
        used: token.used
      });
    }
    
    // Check if there are any issues with the password reset process
    console.log('🔍 Checking password reset process...');
    
    // Simulate what happens during password reset
    const newPassword = 'NewPassword123!';
    const newHash = await bcrypt.hash(newPassword, 12);
    console.log('✅ New password hash created');
    
    // Test the new password comparison
    const newPasswordValid = await bcrypt.compare(newPassword, newHash);
    console.log('🔑 New password comparison test:', newPasswordValid ? '✅ PASS' : '❌ FAIL');
    
    if (!newPasswordValid) {
      console.log('❌ CRITICAL: New password comparison failed!');
      console.log('This suggests a bcrypt issue.');
    }
    
    console.log('✅ Password flow test completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testPasswordFlow();