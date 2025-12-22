const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkMuseums() {
  try {
    const res = await pool.query("SELECT * FROM tb_sites WHERE name ILIKE '%Museum Majapahit%' OR name ILIKE '%Museum Sumpah Pemuda%'");
    console.log('Museums found:', res.rows.length);
    res.rows.forEach(museum => {
      console.log('---');
      console.log('ID:', museum.id);
      console.log('Name:', museum.name);
      console.log('Type:', museum.type);
      console.log('Is Active:', museum.is_active);
      console.log('Is Approved:', museum.is_approved);
      console.log('Is Rejected:', museum.is_rejected);
      console.log('Latitude:', museum.latitude);
      console.log('Longitude:', museum.longitude);
      console.log('Opening Hours:', museum.opening_hours);
      console.log('Phone:', museum.phone);
      console.log('Website:', museum.website);
      console.log('Description:', museum.description ? museum.description.substring(0, 50) + '...' : 'null');
    });
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await pool.end();
  }
}

checkMuseums();
