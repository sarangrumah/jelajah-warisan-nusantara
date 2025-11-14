import pool from '../config/database';

/**
 * Script to alter the existing translation cache table to add missing columns
 */
async function alterTranslationCacheTable() {
  console.log('🔄 Altering translation cache table...');

  try {
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'content_translation_cache';
    `);

    if (tableCheck.rows.length === 0) {
      console.log('❌ Table content_translation_cache does not exist. Please run create-translation-cache-table.ts first.');
      process.exit(1);
    }

    console.log('✅ Table content_translation_cache exists');

    // Check if usage_count column exists
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'content_translation_cache' AND column_name = 'usage_count';
    `);

    if (columnCheck.rows.length === 0) {
      console.log('➕ Adding usage_count column...');
      await pool.query(`
        ALTER TABLE content_translation_cache 
        ADD COLUMN usage_count INTEGER DEFAULT 0;
      `);
      console.log('✅ Added usage_count column');
    } else {
      console.log('✅ usage_count column already exists');
    }

    // Check if last_used column exists
    const lastUsedCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'content_translation_cache' AND column_name = 'last_used';
    `);

    if (lastUsedCheck.rows.length === 0) {
      console.log('➕ Adding last_used column...');
      await pool.query(`
        ALTER TABLE content_translation_cache 
        ADD COLUMN last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
      console.log('✅ Added last_used column');
    } else {
      console.log('✅ last_used column already exists');
    }

    // Check if created_at column exists
    const createdAtCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'content_translation_cache' AND column_name = 'created_at';
    `);

    if (createdAtCheck.rows.length === 0) {
      console.log('➕ Adding created_at column...');
      await pool.query(`
        ALTER TABLE content_translation_cache 
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);
      console.log('✅ Added created_at column');
    } else {
      console.log('✅ created_at column already exists');
    }

    // Drop and recreate indexes to include new columns
    console.log('🔄 Recreating indexes...');
    
    try {
      await pool.query('DROP INDEX IF EXISTS idx_translation_cache_usage');
    } catch (error) {
      console.log('ℹ️  Index idx_translation_cache_usage does not exist or cannot be dropped');
    }

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_cache_usage 
      ON content_translation_cache(usage_count DESC, last_used DESC);
    `);
    console.log('✅ Recreated idx_translation_cache_usage index');

    // Verify the table structure
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'content_translation_cache'
      ORDER BY ordinal_position;
    `);

    console.log('📋 Current table structure:');
    structure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });

    console.log('🎉 Translation cache table altered successfully!');

  } catch (error) {
    console.error('❌ Error altering translation cache table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
alterTranslationCacheTable();