const { Pool } = require('pg');
require('dotenv').config();

// Manually set config to avoid parsing issues with special chars in password
const config = {
  user: 'postgres',
  password: 'M@ryadi86!',
  host: 'localhost',
  port: 5432,
  database: 'mcb_db',
  ssl: false
};

const pool = new Pool(config);

async function checkTable() {
  try {
    console.log('Checking tb_laboratorium_konservasi table...');
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tb_laboratorium_konservasi'
      );
    `);
    
    console.log('Table exists:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Get columns
      const columns = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'tb_laboratorium_konservasi';
      `);
      
      console.log('Columns:');
      columns.rows.forEach(col => {
        console.log(`- ${col.column_name} (${col.data_type})`);
      });

      // Try to select
      console.log('\nTrying to select all rows...');
      const rows = await pool.query('SELECT * FROM tb_laboratorium_konservasi');
      console.log(`Found ${rows.rows.length} rows.`);
      if (rows.rows.length > 0) {
        console.log('First row:', JSON.stringify(rows.rows[0], null, 2));
      }
    } else {
      console.log('Table does not exist! You may need to run a migration.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkTable();