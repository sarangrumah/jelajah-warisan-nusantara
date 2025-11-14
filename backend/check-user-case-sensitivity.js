// Check for case sensitivity issues in database
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

async function checkCaseSensitivity() {
  const targetEmail = 'sarangrumah.dev@gmail.com';
  
  try {
    console.log('🔍 Checking database case sensitivity for user:', targetEmail);
    
    // Check database collation settings
    const collationResult = await pool.query(`
      SELECT datname, datcollate, datctype 
      FROM pg_database 
      WHERE datname = current_database()
    `);
    
    console.log('\n📊 Database collation settings:');
    console.log('  Database:', collationResult.rows[0].datname);
    console.log('  Collation:', collationResult.rows[0].datcollate);
    console.log('  Character Type:', collationResult.rows[0].datctype);
    
    // Check if email column is case sensitive
    const emailVariations = [
      targetEmail,
      targetEmail.toLowerCase(),
      targetEmail.toUpperCase(),
      'Sarangrumah.Dev@Gmail.com',
      'SARANGRUMAH.DEV@GMAIL.COM'
    ];
    
    console.log('\n🔍 Testing email variations:');
    for (const emailVar of emailVariations) {
      const result = await pool.query(
        'SELECT id, email FROM users WHERE email = $1', 
        [emailVar]
      );
      console.log(`  "${emailVar}": ${result.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
      if (result.rows.length > 0) {
        console.log(`     User ID: ${result.rows[0].id}`);
        console.log(`     Email in DB: "${result.rows[0].email}"`);
      }
    }
    
    // Check if there are multiple users with different cases
    const similarEmails = await pool.query(`
      SELECT id, email 
      FROM users 
      WHERE LOWER(email) = LOWER($1)
    `, [targetEmail]);
    
    console.log('\n👥 Users with similar emails (case-insensitive):');
    if (similarEmails.rows.length > 0) {
      similarEmails.rows.forEach(user => {
        console.log(`  ID: ${user.id}, Email: "${user.email}"`);
      });
    } else {
      console.log('  No users found with similar emails');
    }
    
    // Check the specific user's password hash
    const userResult = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)', 
      [targetEmail]
    );
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      console.log('\n🔑 User details:');
      console.log(`  ID: ${user.id}`);
      console.log(`  Email: "${user.email}"`);
      console.log(`  Password Hash Length: ${user.password_hash?.length || 'NULL'}`);
      console.log(`  Password Hash Starts With: ${user.password_hash ? user.password_hash.substring(0, 20) + '...' : 'NULL'}`);
      
      // Check if password_hash is NULL
      if (!user.password_hash) {
        console.log('❌ CRITICAL: Password hash is NULL! This user cannot login.');
      }
    } else {
      console.log(`❌ No user found with email (case-insensitive): ${targetEmail}`);
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('1. If email case differs between login and registration, use LOWER() in queries');
    console.log('2. Ensure email normalization is applied consistently across all endpoints');
    console.log('3. Check if password_hash is NULL for the affected user');
    console.log('4. Consider adding unique constraint on LOWER(email) to prevent duplicates');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

checkCaseSensitivity();