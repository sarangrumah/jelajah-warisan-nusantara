import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    console.log('🔑 Verifying token with secret length:', process.env.JWT_SECRET?.length);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    console.log('✅ Token decoded successfully:', { userId: decoded.userId, email: decoded.email });
    
    // Fetch user with roles
    const userResult = await query(
      `SELECT p.*, COALESCE(array_agg(ur.role), '{}') as roles
       FROM profiles p
       LEFT JOIN user_roles ur ON p.user_id = ur.user_id
       WHERE p.user_id = $1
       GROUP BY p.id, p.user_id, p.display_name, p.avatar_url, p.created_at, p.updated_at`,
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      roles: userResult.rows[0].roles.filter((role: string) => role !== null)
    };

    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasRole = roles.some(role => req.user!.roles.includes(role));
    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireAdminOrEditor = requireRole(['admin', 'editor']);