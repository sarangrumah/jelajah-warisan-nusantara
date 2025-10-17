import express from 'express';
import {
  getLanguages,
  getTranslationsByLanguage,
  getTranslation,
  createOrUpdateTranslation,
  bulkCreateTranslations,
  updateTranslation,
  deleteTranslation,
  getAllTranslations,
  retranslateAll,
  checkTranslationHealth
} from '../controllers/translationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * Translation Routes
 * 
 * Public routes (no authentication):
 * - GET /languages - Get all active languages
 * - GET /by-language/:lang - Get all translations for a language
 * - GET /health - Check translation service health
 * 
 * Protected routes (require authentication):
 * - GET / - Get all translations (admin view)
 * - GET /single - Get specific translation
 * - POST / - Create or update translation
 * - POST /bulk - Bulk create translations for all languages
 * - PUT /:id - Update translation
 * - DELETE /:id - Delete translation
 * - POST /retranslate - Re-translate all auto-translated entries
 */

// Public routes (no authentication required)
router.get('/languages', getLanguages);
router.get('/by-language/:lang', getTranslationsByLanguage);
router.get('/health', checkTranslationHealth);

// Protected routes (require authentication)
router.get('/', authenticateToken, getAllTranslations);
router.get('/single', authenticateToken, getTranslation);
router.post('/', authenticateToken, createOrUpdateTranslation);
router.post('/bulk', authenticateToken, bulkCreateTranslations);
router.put('/:id', authenticateToken, updateTranslation);
router.delete('/:id', authenticateToken, deleteTranslation);
router.post('/retranslate', authenticateToken, retranslateAll);

export default router;
