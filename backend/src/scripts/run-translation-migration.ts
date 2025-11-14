import pool from '../config/database';
import fs from 'fs';
import path from 'path';

async function runTranslationMigration() {
  try {
    console.log('🚀 Starting translation migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', '..', '..', 'database', 'add-all-missing-translations.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const client = await pool.connect();
    try {
      console.log('📝 Executing migration...');
      await client.query(sql);
      console.log('✅ Migration completed successfully!');
      
      // Verify the migration
      const result = await client.query('SELECT language_code, COUNT(*) as count FROM translations GROUP BY language_code');
      console.log('📊 Translation counts by language:');
      result.rows.forEach(row => {
        console.log(`   ${row.language_code}: ${row.count} translations`);
      });
      
      // Check specific translations
      const navResult = await client.query(`SELECT key, text FROM translations WHERE module = 'common' AND page = 'nav' AND language_code = 'id' LIMIT 5`);
      console.log('🔍 Sample navigation translations:');
      navResult.rows.forEach(row => {
        console.log(`   ${row.key}: "${row.text}"`);
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runTranslationMigration();