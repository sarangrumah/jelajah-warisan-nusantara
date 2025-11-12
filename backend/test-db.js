// Test database connection
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

async function testDatabase() {
  console.log('🔍 Testing Database Connection...\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test if password_reset_tokens table exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'password_reset_tokens'
      );
    `);
    
    console.log('📊 Password reset tokens table exists:', result.rows[0].exists);
    
    // Check users in database
    const usersResult = await client.query('SELECT email FROM users LIMIT 10');
    console.log('\n👤 Users in database:');
    if (usersResult.rows.length === 0) {
      console.log('   No users found');
    } else {
      usersResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.email}`);
      });
    }
    
    client.release();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n💡 Common Solutions:');
    console.log('   1. Check if PostgreSQL is running');
    console.log('   2. Verify DATABASE_URL in backend/.env');
    console.log('   3. Check database credentials');
    console.log('   4. Ensure database "mcb_db" exists');
  } finally {
    await pool.end();
  }
}

testDatabase();