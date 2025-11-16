import express, { Request, Response } from 'express';
import translationService from '../services/translationService';

const router = express.Router();

/**
 * POST /api/translate
 * Translate text using LibreTranslate
 * Public endpoint for frontend content translation
 */
router.post('/', async (req: Request, res: Response) => {
  const { text, targetLang, sourceLang = 'id' } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ 
      error: 'Missing required fields: text, targetLang' 
    });
  }

  try {
    const result = await translationService.translate(text, targetLang, sourceLang);
    
    if (result.success) {
      res.json({ 
        translatedText: result.translatedText,
        success: true 
      });
    } else {
      res.status(500).json({ 
        error: result.error || 'Translation failed',
        translatedText: text, // Return original as fallback
        success: false 
      });
    }
  } catch (error) {
    console.error('Translation endpoint error:', error);
    res.status(500).json({ 
      error: 'Translation service error',
      translatedText: text, // Return original as fallback
      success: false 
    });
  }
});

/**
 * POST /api/translate/batch
 * Translate multiple texts in batch
 */
router.post('/batch', async (req: Request, res: Response) => {
  const { texts, targetLang, sourceLang = 'id' } = req.body;

  if (!texts || !Array.isArray(texts) || !targetLang) {
    return res.status(400).json({ 
      error: 'Missing required fields: texts (array), targetLang' 
    });
  }

  try {
    const results = await translationService.translateBatch(texts, targetLang, sourceLang);
    res.json({ results, success: true });
  } catch (error) {
    console.error('Batch translation endpoint error:', error);
    res.status(500).json({ 
      error: 'Batch translation service error',
      success: false 
    });
  }
});

/**
 * GET /api/translate/health
 * Check if translation service is healthy
 */
router.get('/health', async (req: Request, res: Response) => {
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
    console.error('Translation health check error:', error);
    res.status(500).json({
      healthy: false,
      error: 'Failed to check translation service health'
    });
  }
});

export default router;
