import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { clearTranslationCache, getCacheStats } from '../middleware/translateResponse';

const router = Router();

/**
 * Get translation cache statistics
 * GET /api/translation-cache/stats
 */
router.get('/stats', authenticateToken, (req: Request, res: Response) => {
  try {
    const stats = getCacheStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ error: 'Failed to get cache statistics' });
  }
});

/**
 * Clear translation cache
 * POST /api/translation-cache/clear
 */
router.post('/clear', authenticateToken, (req: Request, res: Response) => {
  try {
    clearTranslationCache();
    res.json({
      success: true,
      message: 'Translation cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;
