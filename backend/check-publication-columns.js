const { Pool } = require('pg');

async function checkTableStructure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('=== CHECKING ACTUAL DB TABLE STRUCTURE ===');
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'tb_publication'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ Table tb_publication does not exist!');
      return;
    }
    
    console.log('✅ Table tb_publication exists');
    
    // Get actual column structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'tb_publication' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Actual table columns:');
    columns.rows.forEach((col, i) => {
      console.log(`${i+1}. ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Compare with expected fields from tableConfigs
    const expectedFields = ['id', 'title', 'description', 'type', 'category', 'year', 'size', 'pages', 'downloadCount', 'published_at', 'url', 'is_active', 'created_at', 'updated_at', 'is_approved', 'is_rejected', 'reason_rejected'];
    
    console.log('\n🔍 Expected fields from tableConfigs:');
    expectedFields.forEach((field, i) => {
      const exists = columns.rows.some(col => col.column_name === field);
      console.log(`${i+1}. ${field}: ${exists ? '✅' : '❌'}`);
    });
    
    // Check for field mismatches (snake_case vs camelCase)
    console.log('\n🔀 Possible field name mismatches:');
    columns.rows.forEach(col => {
      const camelCase = col.column_name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      const expected = expectedFields.find(field => field.toLowerCase() === camelCase.toLowerCase());
      if (expected && expected !== col.column_name) {
        console.log(`  ${col.column_name} (actual) -> ${expected} (expected)`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();