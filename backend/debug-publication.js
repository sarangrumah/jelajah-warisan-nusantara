const { Pool } = require('pg');

// Create a simple test to debug the publication creation issue
const testPublicationData = {
  id: '550e8400-e29b-41d4-a716-446655440000', // UUID for testing
  title: 'Test Publication',
  description: 'Test description',
  type: 'publication',
  category: 'berita',
  year: '2025',
  size: '1 MB',
  pages: 1,
  downloadCount: 0,
  published_at: '2025-12-22T17:54:00.000Z',
  url: '/uploads/publication/test.pdf',
  is_active: false,
  is_approved: false,
  is_rejected: false,
  reason_rejected: '',
  created_at: new Date(),
  updated_at: new Date()
};

console.log('Testing publication creation...');
console.log('Data:', testPublicationData);

// Test direct database insertion
async function testInsert() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/museum_cagar_budaya',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // First, let's check if the table exists and what columns it has
    console.log('\n=== CHECKING TABLE STRUCTURE ===');
    const tableResult = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'tb_publication' 
      ORDER BY ordinal_position
    `);
    
    console.log('Table columns:');
    tableResult.rows.forEach((row, i) => {
      console.log(`${i+1}. ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Now let's try to insert
    console.log('\n=== TESTING INSERT ===');
    const fields = ['id', 'title', 'description', 'type', 'category', 'year', 'size', 'pages', 'downloadCount', 'published_at', 'url', 'is_active', 'created_at', 'updated_at', 'is_approved', 'is_rejected', 'reason_rejected'];
    const values = fields.map((field, i) => `$${i+1}`).join(', ');
    
    const insertQuery = `INSERT INTO tb_publication (${fields.join(', ')}) VALUES (${values})`;
    console.log('Insert query:', insertQuery);
    
    const result = await pool.query(insertQuery, fields.map(field => testPublicationData[field]));
    console.log('Insert successful! ID:', result.rows[0]?.id);
    
    // Clean up test data
    await pool.query('DELETE FROM tb_publication WHERE id = $1', [testPublicationData.id]);
    console.log('Test data cleaned up');
    
  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.hint) console.error('Hint:', error.hint);
  } finally {
    await pool.end();
  }
}

testInsert();