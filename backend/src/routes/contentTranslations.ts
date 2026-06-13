import express, { Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, requireAdminOrEditor, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * Admin-curated content translation overrides.
 * Lets editors correct auto-translated content per (table, row, field, language).
 */

// List overrides, optionally filtered by table and language
router.get('/', authenticateToken, requireAdminOrEditor, async (req: AuthRequest, res: Response) => {
  try {
    const { table, lang } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];
    if (table) { params.push(table); conditions.push(`table_name = $${params.length}`); }
    if (lang) { params.push(lang); conditions.push(`lang = $${params.length}`); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await query(
      `SELECT * FROM content_translation_overrides ${where} ORDER BY updated_at DESC LIMIT 2000`,
      params
    );
    res.json(result.rows);
  } catch (error) {
    console.error('List content translation overrides error:', error);
    res.status(500).json({ error: 'Failed to list overrides' });
  }
});

// Upsert an override
router.put('/', authenticateToken, requireAdminOrEditor, async (req: AuthRequest, res: Response) => {
  try {
    const { table_name, row_id, field, lang, source_text, translation } = req.body || {};
    if (!table_name || !row_id || !field || !lang || translation === undefined || translation === null) {
      return res.status(400).json({ error: 'table_name, row_id, field, lang and translation are required' });
    }
    const updatedBy = req.user?.email || req.user?.id || null;
    const result = await query(
      `INSERT INTO content_translation_overrides (table_name, row_id, field, lang, source_text, translation, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, now())
       ON CONFLICT (table_name, row_id, field, lang)
       DO UPDATE SET translation = EXCLUDED.translation,
                     source_text = EXCLUDED.source_text,
                     updated_by  = EXCLUDED.updated_by,
                     updated_at  = now()
       RETURNING *`,
      [table_name, row_id, field, lang, source_text ?? null, translation, updatedBy]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Upsert content translation override error:', error);
    res.status(500).json({ error: 'Failed to save override' });
  }
});

// Delete an override (revert to auto-translation)
router.delete('/:id', authenticateToken, requireAdminOrEditor, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM content_translation_overrides WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Override not found' });
    }
    res.json({ deleted: id });
  } catch (error) {
    console.error('Delete content translation override error:', error);
    res.status(500).json({ error: 'Failed to delete override' });
  }
});

export default router;
