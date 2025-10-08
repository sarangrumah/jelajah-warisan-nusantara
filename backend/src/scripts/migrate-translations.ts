import pool from '../config/database';

/**
 * Migration Script: Move hardcoded translations to database
 * This script extracts translations from the i18n JSON structure and inserts them into the database
 */

// Hardcoded translations from src/i18n/index.ts
const translations = {
  en: {
    translation: {
      // Navigation
      nav: {
        beranda: "Home",
        destinasi: "Destination",
        museum: "Museum",
        heritage: "Heritage",
        collection: "Collection",
        koleksi: "MCB Collection",
        mow: "Memory Of the World",
        agenda: "Agenda",
        tentangKami: "About Us",
        strukturOrganisasi: "Organizational structure",
        layananKonservasi: "Conservation Services",
        mediaPublikasi: "Media & Publications",
        hubungiKami: "Contact Us",
        career: "Career",
        ppid: "PPID",
        sop: "Standard Operating Procedures",
        admin: "Admin"
      },
      // Add more sections as needed...
    }
  },
  id: {
    translation: {
      // Navigation
      nav: {
        beranda: "Beranda",
        destinasi: "Destinasi",
        museum: "Museum",
        heritage: "Cagar Budaya",
        collection: "Koleksi",
        koleksi: "Koleksi MCB",
        mow: "Memori Dunia",
        agenda: "Agenda",
        tentangKami: "Tentang Kami",
        strukturOrganisasi: "Struktur Organisasi",
        layananKonservasi: "Laboratorium Konservasi",
        mediaPublikasi: "Berita & Publikasi",
        hubungiKami: "Hubungi Kami",
        career: "Karir",
        ppid: "PPID",
        sop: "Prosedur Operasional Standar",
        admin: "Admin"
      },
      // Add more sections as needed...
    }
  }
};

interface TranslationEntry {
  module: string;
  page: string;
  key: string;
  language_code: string;
  text: string;
}

/**
 * Flatten nested translation object into flat array
 */
function flattenTranslations(
  obj: any,
  languageCode: string,
  module: string = 'translation',
  page: string = '',
  prefix: string = ''
): TranslationEntry[] {
  const entries: TranslationEntry[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // Leaf node - this is a translation
      entries.push({
        module,
        page: page || 'general',
        key: fullKey,
        language_code: languageCode,
        text: value
      });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Nested object - recurse
      const newPage = page ? page : key;
      entries.push(...flattenTranslations(value, languageCode, module, newPage, page ? fullKey : ''));
    } else if (Array.isArray(value)) {
      // Array - store as JSON string
      entries.push({
        module,
        page: page || 'general',
        key: fullKey,
        language_code: languageCode,
        text: JSON.stringify(value)
      });
    }
  }

  return entries;
}

/**
 * Insert translations into database
 */
async function insertTranslations(entries: TranslationEntry[]): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const entry of entries) {
      try {
        await client.query(
          `INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (module, page, key, language_code) DO NOTHING`,
          [entry.module, entry.page, entry.key, entry.language_code, entry.text, false]
        );
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting translation: ${entry.module}.${entry.page}.${entry.key}`, error);
        skippedCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`✅ Migration completed: ${insertedCount} translations inserted, ${skippedCount} skipped`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Main migration function
 */
async function migrateTranslations(): Promise<void> {
  console.log('🚀 Starting translation migration...');

  try {
    // Check if tables exist
    const tableCheck = await pool.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'translations'
      )`
    );

    if (!tableCheck.rows[0].exists) {
      console.error('❌ Translation tables do not exist. Please run the migration SQL first.');
      process.exit(1);
    }

    const allEntries: TranslationEntry[] = [];

    // Process each language
    for (const [langCode, langData] of Object.entries(translations)) {
      console.log(`📝 Processing ${langCode} translations...`);
      const entries = flattenTranslations(langData.translation, langCode);
      allEntries.push(...entries);
      console.log(`   Found ${entries.length} translation entries`);
    }

    console.log(`📊 Total translations to migrate: ${allEntries.length}`);

    // Insert into database
    await insertTranslations(allEntries);

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if executed directly
if (require.main === module) {
  migrateTranslations();
}

export { migrateTranslations, flattenTranslations };
