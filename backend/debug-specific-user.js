// Debug specific user issue
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

async function debugSpecificUser() {
  const targetEmail = 'sarangrumah.dev@gmail.com';
  
  try {
    console.log(`🔍 Debugging user: ${targetEmail}`);
    
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1', 
      [targetEmail]
    );
    
    if (userResult.rows.length === 0) {
      console.log(`❌ User not found: ${targetEmail}`);
      
      // Check with normalized email
      const normalizedEmail = targetEmail.toLowerCase();
      const normalizedResult = await pool.query(
        'SELECT id, email, password_hash FROM users WHERE email = $1', 
        [normalizedEmail]
      );
      
      if (normalizedResult.rows.length > 0) {
        console.log(`⚠️ User found with normalized email: ${normalizedEmail}`);
        console.log(`   Original email in DB: ${normalizedResult.rows[0].email}`);
      } else {
        console.log(`❌ User not found even with normalized email: ${normalizedEmail}`);
      }
      return;
    }
    
    const user = userResult.rows[0];
    console.log(`✅ User found:`, { 
      id: user.id, 
      email: user.email,
      passwordHashLength: user.password_hash?.length || 'NULL',
      passwordHashStartsWith: user.password_hash ? user.password_hash.substring(0, 20) + '...' : 'NULL'
    });
    
    // Check password reset tokens for this user
    const tokensResult = await pool.query(
      'SELECT token, expires_at, used FROM password_reset_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [user.id]
    );
    
    console.log(`📊 Password reset tokens for user: ${tokensResult.rows.length}`);
    tokensResult.rows.forEach((token, index) => {
      const now = new Date();
      const isExpired = new Date(token.expires_at) < now;
      console.log(`  Token ${index + 1}: ${token.token.substring(0, 10)}...`);
      console.log(`    Expires: ${token.expires_at}`);
      console.log(`    Used: ${token.used}`);
      console.log(`    Status: ${isExpired ? '❌ EXPIRED' : token.used ? '✅ USED' : '⏳ ACTIVE'}`);
    });
    
    // Test password comparison with a known password
    const testPassword = 'test123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log(`🔑 Test password "${testPassword}" comparison: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    
    // Check if there are any case sensitivity issues
    const emailVariations = [
      targetEmail,
      targetEmail.toLowerCase(),
      targetEmail.toUpperCase(),
      'Sarangrumah.Dev@Gmail.com',
      'SARANGRUMAH.DEV@GMAIL.COM'
    ];
    
    console.log(`\n🔍 Checking email case variations:`);
    for (const emailVar of emailVariations) {
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1', 
        [emailVar]
      );
      console.log(`  "${emailVar}": ${result.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

debugSpecificUser();