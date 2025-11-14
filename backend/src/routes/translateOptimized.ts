import express from 'express';
import optimizedContentTranslationService from '../services/optimizedContentTranslationService';

const router = express.Router();

interface BatchTranslationRequest {
  texts: string[];
  source: string;
  target: string;
}

interface BatchTranslationResponse {
  translations: string[];
  cacheHits: number;
  apiCalls: number;
  totalTime: number;
  success: boolean;
}

/**
 * Batch Translation API Endpoint
 * 
 * This endpoint provides optimized batch translation with caching
 * to significantly reduce translation API calls and improve performance
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts, source, target }: BatchTranslationRequest = req.body;

    // Validate request
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: texts must be an array'
      });
    }

    if (!source || !target) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: source and target languages are required'
      });
    }

    if (texts.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Too many texts in batch. Maximum 100 texts per request.'
      });
    }

    console.log(`🔄 Batch translation request: ${texts.length} texts from ${source} to ${target}`);

    const startTime = Date.now();
    const result = await optimizedContentTranslationService.translateBatch({
      texts,
      source,
      target
    });

    const response: BatchTranslationResponse = {
      ...result,
      success: true
    };

    console.log(`✅ Batch translation completed: ${result.cacheHits} cache hits, ${result.apiCalls} API calls, ${result.totalTime}ms`);

    res.json(response);
  } catch (error) {
    console.error('❌ Batch translation error:', error);
    res.status(500).json({
      success: false,
      error: 'Translation service temporarily unavailable',
      translations: req.body.texts || [] // Return original texts on error
    });
  }
});

/**
 * Translation Cache Statistics Endpoint
 */
router.get('/cache-stats', async (req, res) => {
  try {
    const stats = await optimizedContentTranslationService.getCacheStats();
    res.json({
      success: true,
      ...stats
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache statistics'
    });
  }
});

/**
 * Clear Translation Cache Endpoint
 */
router.post('/clear-cache', async (req, res) => {
  try {
    await optimizedContentTranslationService.clearCaches();
    res.json({
      success: true,
      message: 'Translation caches cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cache'
    });
  }
});

/**
 * Pre-translate Common Content Endpoint
 * (Admin/development endpoint to warm up cache)
 */
router.post('/pre-translate', async (req, res) => {
  try {
    await optimizedContentTranslationService.preTranslateCommonContent();
    res.json({
      success: true,
      message: 'Common content pre-translation completed'
    });
  } catch (error) {
    console.error('Error pre-translating common content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pre-translate common content'
    });
  }
});

/**
 * Health Check Endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const stats = await optimizedContentTranslationService.getCacheStats();
    res.json({
      success: true,
      status: 'healthy',
      cache: {
        memoryEntries: stats.memoryCacheSize,
        databaseEntries: stats.dbCacheEntries,
        totalTranslations: stats.totalTranslations
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: 'Translation service health check failed'
    });
  }
});

export default router;