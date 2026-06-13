import { Request, Response, NextFunction } from 'express';
import { insertActivityLog, ActivityLog } from '../controllers/activityLogController';

// Utility to extract IP address
function getIp(req: Request): string | null {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket?.remoteAddress ||
    null
  );
}

// Middleware to log activity
export async function logActivity(options: {
  activity_type: string;
  target_type?: string;
  target_id?: string;
  details?: any;
  success?: boolean;
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user_type = req.user?.role || 'visitor';
      const user_id = req.user?.id ? Number(req.user.id) : null;
      const session_id = req.sessionID || null;
      const ip_address = getIp(req);
      const activity: ActivityLog = {
        user_type,
        user_id,
        session_id,
        ip_address,
        activity_type: options.activity_type,
        target_type: options.target_type,
        target_id: options.target_id,
        details: options.details || {},
        success: options.success,
      };
      await insertActivityLog(activity);
    } catch (err) {
      // Do not block request on logging error
      console.error('Activity log error:', err);
    }
    next();
  };
}

// General hook for logging any request (for global logging, attach to app.use)
export async function globalActivityLogger(req: Request, res: Response, next: NextFunction) {
  // High-frequency page-view beacon has its own table; don't double-log it here.
  if (req.path === '/api/track' || req.originalUrl.startsWith('/api/track')) {
    return next();
  }
  // Example: log all GET/POST/PUT/DELETE requests for visitors/admins
  try {
    const user_type = req.user?.role || 'visitor';
    const user_id = req.user?.id ? Number(req.user.id) : null;
    const session_id = req.sessionID || null;
    const ip_address = getIp(req);
    const activity: ActivityLog = {
      user_type,
      user_id,
      session_id,
      ip_address,
      activity_type: `${req.method} ${req.originalUrl}`,
      details: {},
    };
    await insertActivityLog(activity);
  } catch (err) {
    // Do not block request on logging error
    console.error('Global activity log error:', err);
  }
  next();
}