const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:M@ryadi86!@localhost:5432/mcb_db'
});

async function testPasswordResetFlow() {
  try {
    console.log('🔍 Testing password reset flow...');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', connectionTest.rows[0]);
    
    // Check if password_reset_tokens table exists
    console.log('🔍 Checking password_reset_tokens table...');
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'password_reset_tokens'
      )
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ password_reset_tokens table does not exist!');
      console.log('Creating password_reset_tokens table...');
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(64) NOT NULL UNIQUE,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          used BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
        
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS update_password_reset_tokens_updated_at ON password_reset_tokens;
        CREATE TRIGGER update_password_reset_tokens_updated_at
            BEFORE UPDATE ON password_reset_tokens
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('✅ password_reset_tokens table created successfully');
    } else {
      console.log('✅ password_reset_tokens table exists');
    }
    
    // Check users table structure
    console.log('🔍 Checking users table...');
    const usersColumns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position
    `);
    console.log('Users table structure:');
    usersColumns.rows.forEach(row => console.log('  -', row.column_name, ':', row.data_type));
    
    // Test a sample user
    console.log('🔍 Testing sample user...');
    const testUser = await pool.query('SELECT id, email, password_hash FROM users LIMIT 1');
    if (testUser.rows.length > 0) {
      console.log('✅ Found user:', testUser.rows[0]);
    } else {
      console.log('❌ No users found in database');
    }
    
    console.log('✅ Password reset flow test completed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testPasswordResetFlow();