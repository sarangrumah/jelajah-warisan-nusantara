const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkCollectionStatus() {
  try {
    const targetId = '54157d28-823f-4b1d-be99-9bbaa82fb996';
    console.log(`Checking status for collection with ID: ${targetId}`);

    const query = 'SELECT id, title, is_active, is_approved, is_rejected FROM tb_master_collection WHERE id = $1';
    const result = await pool.query(query, [targetId]);

    if (result.rows.length > 0) {
      console.log('Collection status:', result.rows[0]);
    } else {
      console.log('Collection NOT found in database.');
    }
  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await pool.end();
  }
}

checkCollectionStatus();