const { Pool } = require('pg');

const pool = new Pool({
  host: '10.24.26.75',
  port: 5432,
  user: 'postgres',
  password: 'M@ryadi86!',
  database: 'mcb_db',
  ssl: false
});

async function debugMemoryOfWorld() {
  let client;
  try {
    console.log('🔍 Testing database connection...');
    client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Check if the specific record exists
    console.log('\\n🔍 Checking specific Memory of World record...');
    const result = await client.query('SELECT * FROM tb_memoryoftheworld WHERE id = $1', ['f70009f8-9c1c-4b8e-93b4-bd0350265546']);
    console.log('Record found:', result.rows.length > 0);
    
    if (result.rows.length > 0) {
      console.log('Record data:', JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log('❌ Record not found');
      // Check if there are any records in the table
      const allRecords = await client.query('SELECT id, title FROM tb_memoryoftheworld LIMIT 5');
      console.log('Sample records:', allRecords.rows);
    }
    
    // Check table structure
    console.log('\\n🔍 Checking table structure...');
    const tableInfo = await client.query('SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position', ['tb_memoryoftheworld']);
    console.log('Table structure for tb_memoryoftheworld:');
    tableInfo.rows.forEach(col => {
      console.log('  -', col.column_name, ':', col.data_type, '(nullable:', col.is_nullable, ')');
    });
    
    // Check galleries table
    console.log('\\n🔍 Checking galleries table...');
    const galleriesExist = await client.query('SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)', ['tb_memoryoftheworld_gallery']);
    console.log('Table tb_memoryoftheworld_gallery exists:', galleriesExist.rows[0].exists);
    
    if (galleriesExist.rows[0].exists) {
      const galleries = await client.query('SELECT * FROM tb_memoryoftheworld_gallery WHERE id_memoryoftheworld = $1', ['f70009f8-9c1c-4b8e-93b4-bd0350265546']);
      console.log('Galleries for this record:', galleries.rows);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error stack:', error.stack);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

debugMemoryOfWorld();