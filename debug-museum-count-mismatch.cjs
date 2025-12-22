const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function debugMuseumCount() {
  try {
    console.log('🔍 DEBUG: Running museum count debugging...');
    
    // Original query from production
    const query = `
      SELECT tb_sites.*, 
             tb_type_sites.name as type_name,
             tb_categories_sites.name as category_name
      FROM "public"."tb_sites"
      JOIN tb_type_sites ON tb_type_sites."id" = tb_sites."type"
      JOIN tb_categories_sites ON tb_categories_sites."id" = tb_sites.category
      WHERE tb_type_sites.id = '12bc00a9-ba1a-4562-940d-4e33bb26acdc'
      AND tb_sites.is_active = 't' AND tb_sites.is_approved = 't'
    `;
    
    const result = await pool.query(query);
    console.log('🔍 DEBUG: Total museums from SQL query:', result.rows.length);
    
    result.rows.forEach((museum, index) => {
      console.log(`\n🔍 DEBUG: Museum ${index + 1}:`);
      console.log('  ID:', museum.id);
      console.log('  Name:', museum.name);
      console.log('  Type:', museum.type);
      console.log('  Type Name:', museum.type_name);
      console.log('  Category:', museum.category);
      console.log('  Category Name:', museum.category_name);
      console.log('  Is Active:', museum.is_active);
      console.log('  Is Approved:', museum.is_approved);
    });
    
    // Check what types exist
    console.log('\n🔍 DEBUG: Checking all available types...');
    const typeResult = await pool.query('SELECT * FROM tb_type_sites');
    console.log('Available types:');
    typeResult.rows.forEach(type => {
      console.log(`  ID: ${type.id}, Name: ${type.name}`);
    });
    
    // Check if the specific type ID exists
    console.log('\n🔍 DEBUG: Checking specific type ID...');
    const specificTypeResult = await pool.query('SELECT * FROM tb_type_sites WHERE id = $1', ['12bc00a9-ba1a-4562-940d-4e33bb26acdc']);
    console.log('Specific type result:', specificTypeResult.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

debugMuseumCount();