// Test Gmail dot removal issue
require('dotenv').config();

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

async function testGmailDotIssue() {
  const originalEmail = 'sarangrumah.dev@gmail.com';
  const normalizedEmail = 'sarangrumahdev@gmail.com'; // Without dot
  
  console.log('🔍 Testing Gmail dot removal issue...');
  console.log(`Original email: "${originalEmail}"`);
  console.log(`Normalized email: "${normalizedEmail}"`);
  console.log('');
  
  try {
    // Check if user exists with original email
    const originalResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1', 
      [originalEmail]
    );
    
    console.log(`🔍 Database lookup for "${originalEmail}":`);
    if (originalResult.rows.length > 0) {
      console.log(`✅ FOUND: User ID ${originalResult.rows[0].id}`);
    } else {
      console.log(`❌ NOT FOUND`);
    }
    
    // Check if user exists with normalized email (without dot)
    const normalizedResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1', 
      [normalizedEmail]
    );
    
    console.log(`🔍 Database lookup for "${normalizedEmail}":`);
    if (normalizedResult.rows.length > 0) {
      console.log(`✅ FOUND: User ID ${normalizedResult.rows[0].id}`);
    } else {
      console.log(`❌ NOT FOUND`);
    }
    
    console.log('');
    console.log('🎯 ISSUE IDENTIFIED:');
    if (originalResult.rows.length > 0 && normalizedResult.rows.length === 0) {
      console.log('❌ PROBLEM: User exists with dot in email, but normalization removes the dot!');
      console.log('   This causes login to fail after password reset.');
      console.log('');
      console.log('🚀 SOLUTION OPTIONS:');
      console.log('1. Disable Gmail dot removal in email normalization');
      console.log('2. Update all user emails to normalized form in database');
      console.log('3. Use case-insensitive email comparison in database queries');
    } else if (originalResult.rows.length === 0 && normalizedResult.rows.length > 0) {
      console.log('✅ User exists in normalized form (without dot)');
    } else if (originalResult.rows.length > 0 && normalizedResult.rows.length > 0) {
      console.log('⚠️ Both forms exist - potential duplicate users!');
    } else {
      console.log('❌ User not found in either form');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testGmailDotIssue();