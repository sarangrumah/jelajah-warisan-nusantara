import pool from '../config/database';

/**
 * Script to create the translation cache table for optimized translation system
 */
async function createTranslationCacheTable() {
  console.log('🚀 Creating translation cache table...');

  try {
    // Create the table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS content_translation_cache (
        source_hash VARCHAR(64) NOT NULL,
        lang VARCHAR(10) NOT NULL,
        translation TEXT NOT NULL,
        usage_count INTEGER DEFAULT 0,
        last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (source_hash, lang)
      );
    `);

    console.log('✅ Created content_translation_cache table');

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup 
      ON content_translation_cache(source_hash, lang);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_cache_usage 
      ON content_translation_cache(usage_count DESC, last_used DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_translation_cache_lang 
      ON content_translation_cache(lang);
    `);

    console.log('✅ Created indexes for content_translation_cache table');

    // Add comments
    await pool.query(`
      COMMENT ON TABLE content_translation_cache IS 'Cached translations for optimized performance';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.source_hash IS 'MD5 hash of source text';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.lang IS 'Target language code (en, id, etc)';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.translation IS 'Cached translation text';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.usage_count IS 'Number of times this translation has been used';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.last_used IS 'Last time this translation was accessed';
    `);

    await pool.query(`
      COMMENT ON COLUMN content_translation_cache.created_at IS 'When this translation was first cached';
    `);

    console.log('✅ Added table and column comments');

    // Verify table creation
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'content_translation_cache';
    `);

    if (result.rows.length > 0) {
      console.log('🎉 Translation cache table created successfully!');
    } else {
      throw new Error('Table creation failed');
    }

  } catch (error) {
    console.error('❌ Error creating translation cache table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the script
createTranslationCacheTable();