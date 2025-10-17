import { Request, Response } from 'express';
import pool from '../config/database';
import translationService from '../services/translationService';

/**
 * Translation Controller
 * Handles CRUD operations for translations with automatic translation support
 */

// In-memory cache for translations
const translationCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all active languages
export const getLanguages = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT code, name, flag, is_active FROM languages WHERE is_active = true ORDER BY code'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ error: 'Failed to fetch languages' });
  }
};

// Get all translations for a specific language (with caching and optimization)
export const getTranslationsByLanguage = async (req: Request, res: Response) => {
  const { lang } = req.params;

  try {
    // Check cache first
    const cacheKey = `translations_${lang}`;
    const cached = translationCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`✅ Cache hit for language: ${lang}`);
      // Set cache headers
      res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      res.set('X-Cache-Status', 'HIT');
      return res.json(cached.data);
    }

    console.log(`🔄 Cache miss for language: ${lang}, fetching from database...`);
    const startTime = Date.now();

    // Optimized query - only select needed fields, no sorting
    const result = await pool.query(
      `SELECT module, page, key, text 
       FROM translations 
       WHERE language_code = $1`,
      [lang]
    );

    console.log(`📊 Query took ${Date.now() - startTime}ms, got ${result.rows.length} rows`);

    // Convert flat array to nested object structure for i18n
    const translations: any = { translation: {} };
    
    result.rows.forEach(row => {
      // Flatten structure for i18n: module.page.key -> text
      const fullKey = `${row.module}.${row.page}.${row.key}`;
      translations.translation[fullKey] = row.text;
    });

    console.log(`📊 Object building took ${Date.now() - startTime}ms total`);

    // Cache the result
    translationCache.set(cacheKey, {
      data: translations,
      timestamp: Date.now()
    });

    console.log(`✅ Cached translations for language: ${lang} (${result.rows.length} entries)`);

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    res.set('X-Cache-Status', 'MISS');
    res.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to fetch translations', details: errorMessage });
  }
};

// Clear translation cache (call this when translations are updated)
export const clearTranslationCache = () => {
  translationCache.clear();
  console.log('🗑️  Translation cache cleared');
};

// Get specific translation
export const getTranslation = async (req: Request, res: Response) => {
  const { module, page, key, lang } = req.query;

  if (!module || !page || !key || !lang) {
    return res.status(400).json({ error: 'Missing required parameters: module, page, key, lang' });
  }

  try {
    const result = await pool.query(
      'SELECT text, auto_translated FROM translations WHERE module = $1 AND page = $2 AND key = $3 AND language_code = $4',
      [module, page, key, lang]
    );

    if (result.rows.length > 0) {
      res.json({ 
        translation: result.rows[0].text,
        autoTranslated: result.rows[0].auto_translated
      });
    } else {
      res.status(404).json({ error: 'Translation not found' });
    }
  } catch (error) {
    console.error('Error fetching translation:', error);
    res.status(500).json({ error: 'Failed to fetch translation' });
  }
};

// Create or update translation with auto-translation
export const createOrUpdateTranslation = async (req: Request, res: Response) => {
  const { module, page, key, language_code, text, force_translate } = req.body;

  if (!module || !page || !key || !language_code || !text) {
    return res.status(400).json({ 
      error: 'Missing required fields: module, page, key, language_code, text' 
    });
  }

  try {
    let translatedText = text;
    let autoTranslated = false;

    // Auto-translate if target language is not Indonesian (source language)
    if (language_code !== 'id' || force_translate) {
      const result = await translationService.translate(text, language_code, 'id');
      
      if (result.success) {
        translatedText = result.translatedText;
        autoTranslated = true;
      } else {
        console.warn(`Translation failed for ${module}.${page}.${key}:`, result.error);
        // Continue with original text as fallback
      }
    }

    // Insert or update translation
    const result = await pool.query(
      `INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
       ON CONFLICT (module, page, key, language_code) 
       DO UPDATE SET text = $5, auto_translated = $6, last_updated = NOW()
       RETURNING id, text, auto_translated`,
      [module, page, key, language_code, translatedText, autoTranslated]
    );

    // Clear cache when translations are updated
    clearTranslationCache();

    res.json({ 
      success: true, 
      translation: result.rows[0],
      message: autoTranslated ? 'Translation created with auto-translation' : 'Translation created'
    });
  } catch (error) {
    console.error('Error creating/updating translation:', error);
    res.status(500).json({ error: 'Failed to create/update translation' });
  }
};

// Bulk create translations for all languages
export const bulkCreateTranslations = async (req: Request, res: Response) => {
  const { module, page, key, text } = req.body;

  if (!module || !page || !key || !text) {
    return res.status(400).json({ 
      error: 'Missing required fields: module, page, key, text' 
    });
  }

  try {
    // Get all active languages
    const languagesResult = await pool.query(
      'SELECT code FROM languages WHERE is_active = true'
    );
    const languages = languagesResult.rows.map(row => row.code);

    const results = [];

    // Create translation for each language
    for (const langCode of languages) {
      let translatedText = text;
      let autoTranslated = false;

      // Auto-translate if not Indonesian
      if (langCode !== 'id') {
        const result = await translationService.translate(text, langCode, 'id');
        
        if (result.success) {
          translatedText = result.translatedText;
          autoTranslated = true;
        }
      }

      // Insert or update
      await pool.query(
        `INSERT INTO translations (module, page, key, language_code, text, auto_translated, last_updated) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
         ON CONFLICT (module, page, key, language_code) 
         DO UPDATE SET text = $5, auto_translated = $6, last_updated = NOW()`,
        [module, page, key, langCode, translatedText, autoTranslated]
      );

      results.push({ language: langCode, text: translatedText, autoTranslated });
    }

    res.json({ 
      success: true, 
      translations: results,
      message: `Created translations for ${languages.length} languages`
    });
  } catch (error) {
    console.error('Error bulk creating translations:', error);
    res.status(500).json({ error: 'Failed to bulk create translations' });
  }
};

// Update translation (manual edit)
export const updateTranslation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Missing required field: text' });
  }

  try {
    const result = await pool.query(
      `UPDATE translations 
       SET text = $1, auto_translated = false, last_updated = NOW() 
       WHERE id = $2
       RETURNING id, module, page, key, language_code, text`,
      [text, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    // Clear cache when translations are updated
    clearTranslationCache();

    res.json({ 
      success: true, 
      translation: result.rows[0],
      message: 'Translation updated successfully'
    });
  } catch (error) {
    console.error('Error updating translation:', error);
    res.status(500).json({ error: 'Failed to update translation' });
  }
};

// Delete translation
export const deleteTranslation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM translations WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    // Clear cache when translations are deleted
    clearTranslationCache();

    res.json({ 
      success: true, 
      message: 'Translation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting translation:', error);
    res.status(500).json({ error: 'Failed to delete translation' });
  }
};

// Get all translations in table format (for admin UI)
export const getAllTranslations = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT t.id, t.module, t.page, t.key, t.language_code, t.text, 
              t.auto_translated, t.last_updated, l.name as language_name, l.flag
       FROM translations t
       JOIN languages l ON t.language_code = l.code
       ORDER BY t.module, t.page, t.key, t.language_code`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all translations:', error);
    res.status(500).json({ error: 'Failed to fetch translations' });
  }
};

// Re-translate all auto-translated entries (useful for updates)
export const retranslateAll = async (req: Request, res: Response) => {
  try {
    // Get all auto-translated entries
    const result = await pool.query(
      `SELECT id, module, page, key, language_code, text 
       FROM translations 
       WHERE auto_translated = true AND language_code != 'id'`
    );

    let successCount = 0;
    let failCount = 0;

    for (const row of result.rows) {
      // Get the Indonesian (source) text
      const sourceResult = await pool.query(
        `SELECT text FROM translations 
         WHERE module = $1 AND page = $2 AND key = $3 AND language_code = 'id'`,
        [row.module, row.page, row.key]
      );

      if (sourceResult.rows.length > 0) {
        const sourceText = sourceResult.rows[0].text;
        const translation = await translationService.translate(
          sourceText, 
          row.language_code, 
          'id'
        );

        if (translation.success) {
          await pool.query(
            `UPDATE translations 
             SET text = $1, last_updated = NOW() 
             WHERE id = $2`,
            [translation.translatedText, row.id]
          );
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    res.json({ 
      success: true, 
      message: `Re-translated ${successCount} entries, ${failCount} failed`,
      successCount,
      failCount
    });
  } catch (error) {
    console.error('Error re-translating:', error);
    res.status(500).json({ error: 'Failed to re-translate' });
  }
};

// Check translation service health
export const checkTranslationHealth = async (req: Request, res: Response) => {
  try {
    const isHealthy = await translationService.checkHealth();
    const supportedLanguages = await translationService.getSupportedLanguages();

    res.json({
      healthy: isHealthy,
      service: 'LibreTranslate',
      supportedLanguages: supportedLanguages.length,
      message: isHealthy ? 'Translation service is operational' : 'Translation service is unavailable'
    });
  } catch (error) {
    console.error('Error checking translation health:', error);
    res.status(500).json({ 
      healthy: false,
      error: 'Failed to check translation service health' 
    });
  }
};
