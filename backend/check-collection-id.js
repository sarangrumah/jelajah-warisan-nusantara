const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkCollection() {
  try {
    const targetId = '54157d28-823f-4b1d-be99-9bbaa82fb996';
    console.log(`Checking for collection with ID: ${targetId}`);

    const query = 'SELECT * FROM tb_master_collection WHERE id = $1';
    const result = await pool.query(query, [targetId]);

    if (result.rows.length > 0) {
      console.log('Found collection:', result.rows[0]);
    } else {
      console.log('Collection NOT found in database.');
      
      // Check if there are any collections
      const countQuery = 'SELECT COUNT(*) FROM tb_master_collection';
      const countResult = await pool.query(countQuery);
      console.log(`Total collections in database: ${countResult.rows[0].count}`);
      
      // List first 5 IDs
      const listQuery = 'SELECT id, title FROM tb_master_collection LIMIT 5';
      const listResult = await pool.query(listQuery);
      console.log('First 5 collections:', listResult.rows);
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkCollection();