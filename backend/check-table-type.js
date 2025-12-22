
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:M@ryadi86!@localhost:5432/mcb_db'
});

async function checkTableType() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_name = 'tb_sites';
    `);
    console.log('Table info:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

checkTableType();
