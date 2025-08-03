import { query } from '../config/database';
import bcrypt from 'bcryptjs';

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection and Authentication Setup...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing database connection...');
    const testQuery = await query('SELECT NOW() as current_time');
    console.log('✅ Database connected. Current time:', testQuery.rows[0].current_time);

    // Test 2: Check if users table exists
    console.log('\n2. Checking if users table exists...');
    const tableCheck = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('Run the SQL script: backend/src/scripts/create-users-table.sql');
      return;
    }
    console.log('✅ Users table exists');

    // Test 3: Check table structure
    console.log('\n3. Checking users table structure...');
    const structureCheck = await query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('📋 Table structure:');
    structureCheck.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Test 4: Check if super admin user exists
    console.log('\n4. Checking for super admin user...');
    const adminCheck = await query('SELECT email, password_hash FROM users WHERE email = $1', 
      ['superadmin@museumbudaya.go.id']
    );
    
    if (adminCheck.rows.length === 0) {
      console.log('❌ Super admin user not found!');
      console.log('Run the SQL script: backend/src/scripts/create-users-table.sql');
      return;
    }
    
    const admin = adminCheck.rows[0];
    console.log('✅ Super admin user found:', admin.email);
    console.log('🔑 Password hash:', admin.password_hash.substring(0, 20) + '...');

    // Test 5: Verify password hash works
    console.log('\n5. Testing password verification...');
    const testPassword = 'admin123'; // This should match the hash
    const isValidPassword = await bcrypt.compare(testPassword, admin.password_hash);
    console.log(`🧪 Password '${testPassword}' validation:`, isValidPassword ? '✅ Valid' : '❌ Invalid');

    // Test 6: Check related tables
    console.log('\n6. Checking related tables...');
    const tables = ['profiles', 'user_roles'];
    for (const tableName of tables) {
      const tableExists = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = $1
      `, [tableName]);
      
      if (tableExists.rows.length > 0) {
        const count = await query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`✅ ${tableName} table exists with ${count.rows[0].count} records`);
      } else {
        console.log(`⚠️  ${tableName} table does not exist (this may cause auth issues)`);
      }
    }

    console.log('\n🎉 Database test completed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

// Run the test
testDatabaseConnection().then(() => {
  console.log('\n📝 Next steps if issues found:');
  console.log('1. Check your .env file has correct DATABASE_URL');
  console.log('2. Ensure PostgreSQL is running locally');
  console.log('3. Run the create-users-table.sql script');
  console.log('4. Check if you need to create profiles and user_roles tables');
  process.exit(0);
}).catch(error => {
  console.error('Test script error:', error);
  process.exit(1);
});