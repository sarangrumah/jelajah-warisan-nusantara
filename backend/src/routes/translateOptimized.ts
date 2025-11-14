import express from 'express';
import optimizedContentTranslationService from '../services/optimizedContentTranslationService';

const router = express.Router();

/**
 * Batch translation endpoint with optimizations
 * POST /api/translate/batch-optimized
 * 
 * Request body:
 * {
 *   "texts": ["text1", "text2", "text3"],
 *   "targetLang": "en",
 *   "sourceLang": "id"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "results": [
 *     { "translatedText": "translated1", "success": true },
 *     { "translatedText": "translated2", "success": true },
 *     { "translatedText": "translated3", "success": true }
 *   ],
 *   "metrics": {
 *     "cacheHitRate": 0.75,
 *     "averageResponseTime": 150,
 *     "circuitBreakerState": "CLOSED"
 *   }
 * }
 */
router.post('/batch-optimized', async (req, res) => {
  try {
    const { texts, targetLang, sourceLang = 'id' } = req.body;

    // Validate request
    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({
        error: 'Texts array is required',
        success: false
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        error: 'Target language is required',
        success: false
      });
    }

    // Limit batch size to prevent abuse
    if (texts.length > 100) {
      return res.status(400).json({
        error: 'Batch size too large. Maximum 100 texts per request.',
        success: false
      });
    }

    const startTime = Date.now();
    
    // Perform batch translation
    const results = await optimizedContentTranslationService.translateBatchWithMemory(
      texts,
      targetLang,
      sourceLang
    );

    const responseTime = Date.now() - startTime;
    const metrics = optimizedContentTranslationService.getMetrics();

    res.json({
      success: true,
      results,
      metrics: {
        ...metrics,
        responseTime,
        circuitBreakerState: optimizedContentTranslationService.getCircuitBreakerState()
      }
    });

    // Clear request memory after response
    optimizedContentTranslationService.clearRequestMemory();

  } catch (error) {
    console.error('Optimized batch translation error:', error);
    res.status(500).json({
      error: 'Batch translation failed',
      success: false,
      results: req.body.texts?.map((text: string) => ({ 
        translatedText: text, 
        success: false,
        error: 'Translation service error'
      })) || []
    });
  }
});

/**
 * Single text translation endpoint with optimizations
 * POST /api/translate/single-optimized
 * 
 * Request body:
 * {
 *   "text": "text to translate",
 *   "targetLang": "en",
 *   "sourceLang": "id"
 * }
 */
router.post('/single-optimized', async (req, res) => {
  try {
    const { text, targetLang, sourceLang = 'id' } = req.body;

    if (!text) {
      return res.status(400).json({
        error: 'Text is required',
        success: false
      });
    }

    if (!targetLang) {
      return res.status(400).json({
        error: 'Target language is required',
        success: false
      });
    }

    const startTime = Date.now();
    
    const translatedText = await optimizedContentTranslationService.translateFieldWithMemory(
      text,
      targetLang,
      sourceLang
    );

    const responseTime = Date.now() - startTime;
    const metrics = optimizedContentTranslationService.getMetrics();

    res.json({
      success: true,
      translatedText,
      metrics: {
        ...metrics,
        responseTime,
        circuitBreakerState: optimizedContentTranslationService.getCircuitBreakerState()
      }
    });

    // Clear request memory after response
    optimizedContentTranslationService.clearRequestMemory();

  } catch (error) {
    console.error('Optimized single translation error:', error);
    res.status(500).json({
      error: 'Translation failed',
      success: false,
      translatedText: req.body.text || ''
    });
  }
});

/**
 * Translation metrics endpoint
 * GET /api/translate/metrics
 */
router.get('/metrics', (req, res) => {
  try {
    const metrics = optimizedContentTranslationService.getMetrics();
    const circuitBreakerState = optimizedContentTranslationService.getCircuitBreakerState();

    res.json({
      success: true,
      metrics: {
        ...metrics,
        circuitBreakerState
      }
    });
  } catch (error) {
    console.error('Metrics retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      success: false
    });
  }
});

/**
 * Reset metrics endpoint (for testing)
 * POST /api/translate/metrics/reset
 */
router.post('/metrics/reset', (req, res) => {
  try {
    optimizedContentTranslationService.resetMetrics();
    res.json({
      success: true,
      message: 'Metrics reset successfully'
    });
  } catch (error) {
    console.error('Metrics reset error:', error);
    res.status(500).json({
      error: 'Failed to reset metrics',
      success: false
    });
  }
});

/**
 * Health check endpoint
 * GET /api/translate/health
 */
router.get('/health', async (req, res) => {
  try {
    // Test a simple translation to verify service health
    const testResult = await optimizedContentTranslationService.translateFieldWithMemory(
      'test',
      'en',
      'id'
    );

    const metrics = optimizedContentTranslationService.getMetrics();
    const circuitBreakerState = optimizedContentTranslationService.getCircuitBreakerState();

    res.json({
      status: 'healthy',
      testTranslation: testResult,
      metrics: {
        ...metrics,
        circuitBreakerState
      },
      timestamp: new Date().toISOString()
    });

    // Clear request memory after health check
    optimizedContentTranslationService.clearRequestMemory();

  } catch (error) {
    console.error('Translation health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: 'Translation service is not responding properly',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;