import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { query } from '../config/database';

const router = express.Router();

function getIp(req: Request): string {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Hash IP with a daily-rotating salt so we can count distinct visitors without
// ever storing a raw IP address.
function hashIp(ip: string): string {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const salt = process.env.TRACK_SALT || 'mcb-default-salt';
  return crypto.createHash('sha256').update(`${ip}|${day}|${salt}`).digest('hex');
}

const BOT_RE = /(bot|crawl|spider|slurp|bing|google|yandex|duckduck|baidu|semrush|ahrefs|facebookexternalhit|headless|monitor|uptime|curl|wget|python-requests)/i;

// Public beacon — called by the SPA on route change. No auth.
router.post('/', async (req: Request, res: Response) => {
  try {
    const { path, referrer } = req.body || {};
    if (!path || typeof path !== 'string') {
      return res.status(204).end();
    }
    // Never track admin/internal routes
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return res.status(204).end();
    }
    const ua = (req.headers['user-agent'] || '').toString().slice(0, 512);
    const isBot = BOT_RE.test(ua);
    await query(
      `INSERT INTO page_views (path, referrer, session_id, ip_hash, user_agent, is_bot)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        path.slice(0, 512),
        (referrer || '').toString().slice(0, 512) || null,
        req.sessionID || null,
        hashIp(getIp(req)),
        ua,
        isBot,
      ]
    );
    res.status(204).end();
  } catch (error) {
    console.error('Track page view error:', error);
    res.status(204).end(); // never surface tracking errors to the client
  }
});

export default router;
