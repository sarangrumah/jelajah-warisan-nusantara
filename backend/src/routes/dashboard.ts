import express, { Response } from 'express';
import { query } from '../config/database';
import { authenticateToken, requireAdminOrEditor, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Run a scalar count query, returning 0 on any error (resilient to schema drift).
async function count(sql: string, params: any[] = []): Promise<number> {
  try {
    const r = await query(sql, params);
    return Number(r.rows[0]?.n || 0);
  } catch (e) {
    console.error('dashboard count error:', (e as Error).message);
    return 0;
  }
}

router.get('/stats', authenticateToken, requireAdminOrEditor, async (_req: AuthRequest, res: Response) => {
  try {
    // Resolve museum type id dynamically (heritage = everything else)
    let museumTypeId: string | null = null;
    try {
      const t = await query("SELECT id FROM tb_type_sites WHERE lower(name) = 'museum' LIMIT 1");
      museumTypeId = t.rows[0]?.id || null;
    } catch { /* ignore */ }

    const [
      sitesTotal, museums, publications, media, events,
      activeAgenda, totalUsers, visitorsThisMonth,
    ] = await Promise.all([
      count('SELECT count(*)::int n FROM tb_sites'),
      museumTypeId
        ? count('SELECT count(*)::int n FROM tb_sites WHERE type = $1', [museumTypeId])
        : Promise.resolve(0),
      count('SELECT count(*)::int n FROM tb_publication'),
      count('SELECT count(*)::int n FROM tb_media'),
      count('SELECT count(*)::int n FROM tb_events'),
      count(`SELECT count(*)::int n FROM tb_events
             WHERE COALESCE(is_active,true) = true AND COALESCE(is_approved,true) = true
               AND (end_date IS NULL OR end_date >= now())`),
      count('SELECT count(*)::int n FROM users'),
      count(`SELECT count(DISTINCT session_id)::int n FROM page_views
             WHERE created_at >= date_trunc('month', now()) AND NOT is_bot`),
    ]);

    const heritage = Math.max(0, sitesTotal - museums);
    const totalContent = publications + media + events;

    // 12-month zero-filled series for visitors / new users / new content
    let monthlySeries: any[] = [];
    try {
      const series = await query(`
        WITH months AS (
          SELECT date_trunc('month', now()) - (interval '1 month' * gs) AS m
          FROM generate_series(0, 11) gs
        )
        SELECT to_char(m, 'YYYY-MM') AS month,
          (SELECT count(DISTINCT pv.session_id) FROM page_views pv
             WHERE date_trunc('month', pv.created_at) = months.m AND NOT pv.is_bot)::int AS visitors,
          (SELECT count(*) FROM users u
             WHERE date_trunc('month', u.created_at) = months.m)::int AS users,
          (SELECT count(*) FROM tb_events e
             WHERE date_trunc('month', e.created_at) = months.m)::int AS content
        FROM months
        ORDER BY m ASC
      `);
      monthlySeries = series.rows;
    } catch (e) {
      console.error('dashboard monthly series error:', (e as Error).message);
    }

    // Recent activity from the existing activity_log
    let recentActivity: any[] = [];
    try {
      const r = await query(
        `SELECT activity_type, user_type, "timestamp" AS created_at
         FROM activity_log ORDER BY "timestamp" DESC LIMIT 8`
      );
      recentActivity = r.rows;
    } catch { /* ignore */ }

    res.json({
      totalContent,
      sites: { museum: museums, heritage, total: sitesTotal },
      counts: { publications, media, events },
      activeAgenda,
      totalUsers,
      visitorsThisMonth,
      monthlySeries,
      recentActivity,
    });
  } catch (error) {
    console.error('dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

export default router;
