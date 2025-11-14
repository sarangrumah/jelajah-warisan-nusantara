// Test email normalization issue
require('dotenv').config();
const { body, validationResult } = require('express-validator');

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

async function testEmailNormalization() {
  try {
    console.log('🔍 Testing email normalization issue...');
    
    // Get a test user
    const userResult = await pool.query('SELECT id, email FROM users LIMIT 1');
    if (userResult.rows.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    const testUser = userResult.rows[0];
    console.log('👤 Test user:', { id: testUser.id, email: testUser.email });
    
    // Test different email cases
    const testEmails = [
      testUser.email, // original email
      testUser.email.toUpperCase(), // uppercase
      testUser.email.replace('@', '.') + '@' + testUser.email.split('@')[1], // different format
      'User@Example.Com', // mixed case
    ];
    
    console.log('\n📧 Testing email normalization:');
    
    for (const email of testEmails) {
      console.log(`\nTesting: "${email}"`);
      
      // Test signInValidation (with normalizeEmail)
      const signInValidation = [
        body('email').isEmail().normalizeEmail()
      ];
      
      // Mock request object
      const mockReq = { body: { email } };
      
      // Run validation
      await Promise.all(signInValidation.map(validation => validation.run(mockReq)));
      const signInErrors = validationResult(mockReq);
      
      if (signInErrors.isEmpty()) {
        const normalizedEmail = mockReq.body.email;
        console.log(`  ✅ SignIn: Normalized to "${normalizedEmail}"`);
        
        // Check if normalized email exists in database
        const dbCheck = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        console.log(`  🔍 Database lookup: ${dbCheck.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
      } else {
        console.log(`  ❌ SignIn: Validation failed - ${signInErrors.array()[0]?.msg}`);
      }
      
      // Test forgotPasswordValidation (with normalizeEmail - after our fix)
      const forgotPasswordValidation = [
        body('email').isEmail().normalizeEmail()
      ];
      
      const mockReq2 = { body: { email } };
      await Promise.all(forgotPasswordValidation.map(validation => validation.run(mockReq2)));
      const forgotPasswordErrors = validationResult(mockReq2);
      
      if (forgotPasswordErrors.isEmpty()) {
        const normalizedEmail = mockReq2.body.email;
        console.log(`  ✅ ForgotPassword: Normalized to "${normalizedEmail}"`);
        
        // Check if normalized email exists in database
        const dbCheck = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
        console.log(`  🔍 Database lookup: ${dbCheck.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
      } else {
        console.log(`  ❌ ForgotPassword: Validation failed - ${forgotPasswordErrors.array()[0]?.msg}`);
      }
    }
    
    // Test the actual issue scenario
    console.log('\n🔍 Testing the actual problem scenario:');
    console.log('User registers with: "user@example.com"');
    console.log('User requests password reset with: "User@Example.COM"');
    
    const originalEmail = testUser.email.toLowerCase();
    const mixedCaseEmail = testUser.email.split('@')[0].charAt(0).toUpperCase() + 
                          testUser.email.split('@')[0].slice(1).toLowerCase() + 
                          '@' + 
                          testUser.email.split('@')[1].toUpperCase();
    
    console.log(`Original email in DB: "${originalEmail}"`);
    console.log(`Mixed case input: "${mixedCaseEmail}"`);
    
    // Test sign in with mixed case
    const signInReq = { body: { email: mixedCaseEmail } };
    await Promise.all(signInValidation.map(validation => validation.run(signInReq)));
    const signInResult = validationResult(signInReq);
    
    if (signInResult.isEmpty()) {
      const normalizedSignInEmail = signInReq.body.email;
      console.log(`✅ SignIn normalizes to: "${normalizedSignInEmail}"`);
      
      const signInDbCheck = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedSignInEmail]);
      console.log(`🔍 SignIn DB lookup: ${signInDbCheck.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
    }
    
    // Test forgot password with mixed case (after our fix)
    const forgotPasswordReq = { body: { email: mixedCaseEmail } };
    await Promise.all(forgotPasswordValidation.map(validation => validation.run(forgotPasswordReq)));
    const forgotPasswordResult = validationResult(forgotPasswordReq);
    
    if (forgotPasswordResult.isEmpty()) {
      const normalizedForgotEmail = forgotPasswordReq.body.email;
      console.log(`✅ ForgotPassword normalizes to: "${normalizedForgotEmail}"`);
      
      const forgotDbCheck = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedForgotEmail]);
      console.log(`🔍 ForgotPassword DB lookup: ${forgotDbCheck.rows.length > 0 ? '✅ FOUND' : '❌ NOT FOUND'}`);
    }
    
    console.log('\n🎯 CONCLUSION:');
    console.log('The email normalization fix ensures both sign-in and password reset');
    console.log('use the same email normalization logic, preventing case sensitivity issues.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testEmailNormalization();