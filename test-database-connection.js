// Simple script to test database connection
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/heritage_museum_db'
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('💡 Please check your PostgreSQL credentials and ensure the database is running');
  } finally {
    await pool.end();
  }
}

testConnection();