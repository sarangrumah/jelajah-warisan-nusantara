import pool from '../config/database';

async function runBasicMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting basic translation migration...');

    // Check if translations table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'translations'
      );
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Translations table does not exist');
      return;
    }

    // Check current translation count
    const countResult = await client.query('SELECT COUNT(*) as count FROM translations');
    console.log('📊 Current translations count:', countResult.rows[0].count);

    // Add essential translations
    const essentialTranslations = [
      // Navigation
      ['common', 'nav', 'beranda', 'id', 'Beranda'],
      ['common', 'nav', 'beranda', 'en', 'Home'],
      ['common', 'nav', 'museum', 'id', 'Museum'],
      ['common', 'nav', 'museum', 'en', 'Museums'],
      ['common', 'nav', 'heritage', 'id', 'Cagar Budaya'],
      ['common', 'nav', 'heritage', 'en', 'Cultural Heritage'],
      ['common', 'nav', 'collection', 'id', 'Koleksi'],
      ['common', 'nav', 'collection', 'en', 'Collections'],
      ['common', 'nav', 'agenda', 'id', 'Agenda'],
      ['common', 'nav', 'agenda', 'en', 'Agenda'],
      ['common', 'nav', 'tentangKami', 'id', 'Tentang Kami'],
      ['common', 'nav', 'tentangKami', 'en', 'About Us'],
      ['common', 'nav', 'hubungiKami', 'id', 'Hubungi Kami'],
      ['common', 'nav', 'hubungiKami', 'en', 'Contact Us'],
      
      // Footer
      ['common', 'footer', 'orgName', 'id', 'Museum dan Cagar Budaya'],
      ['common', 'footer', 'orgName', 'en', 'Museum and Cultural Heritage'],
      ['common', 'footer', 'contactUs', 'id', 'Hubungi Kami'],
      ['common', 'footer', 'contactUs', 'en', 'Contact Us'],
      ['common', 'footer', 'copyright', 'id', '© 2024 Museum dan Cagar Budaya. Hak Cipta Dilindungi.'],
      ['common', 'footer', 'copyright', 'en', '© 2024 Museum and Cultural Heritage. All Rights Reserved.'],
      
      // Common buttons
      ['common', 'buttons', 'learnMore', 'id', 'Pelajari Lebih Lanjut'],
      ['common', 'buttons', 'learnMore', 'en', 'Learn More'],
      ['common', 'buttons', 'readMore', 'id', 'Baca Selengkapnya'],
      ['common', 'buttons', 'readMore', 'en', 'Read More'],
      ['common', 'buttons', 'viewAll', 'id', 'Lihat Semua'],
      ['common', 'buttons', 'viewAll', 'en', 'View All'],
      ['common', 'buttons', 'search', 'id', 'Cari'],
      ['common', 'buttons', 'search', 'en', 'Search'],
      ['common', 'buttons', 'filter', 'id', 'Filter'],
      ['common', 'buttons', 'filter', 'en', 'Filter'],
    ];

    let insertedCount = 0;
    let updatedCount = 0;

    for (const [module, page, key, language_code, text] of essentialTranslations) {
      try {
        const result = await client.query(`
          INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, false, NOW(), NOW())
          ON CONFLICT (module, page, key, language_code) 
          DO UPDATE SET text = EXCLUDED.text, updated_at = NOW()
          RETURNING (xmax = 0) as inserted
        `, [module, page, key, language_code, text]);

        if (result.rows[0].inserted) {
          insertedCount++;
        } else {
          updatedCount++;
        }
      } catch (error: any) {
        console.error(`❌ Failed to insert translation ${module}.${page}.${key}.${language_code}:`, error.message);
      }
    }

    console.log(`✅ Migration completed: ${insertedCount} inserted, ${updatedCount} updated`);

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

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
    console.log('🏁 Migration completed');
  }
}

runBasicMigration();