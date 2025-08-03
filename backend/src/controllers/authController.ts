import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

export const signUpValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').optional().isLength({ min: 1, max: 100 })
];

export const signInValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
];

interface User {
  id: string;
  email: string;
  password_hash: string;
  display_name?: string;
  created_at: Date;
}

export const signUp = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);

    const client = await query('BEGIN');
    
    try {
      // Create user in users table (we need to create this table)
      await query(
        'INSERT INTO users (id, email, password_hash, created_at) VALUES ($1, $2, $3, NOW())',
        [userId, email, passwordHash]
      );

      // Create profile
      await query(
        'INSERT INTO profiles (user_id, display_name) VALUES ($1, $2)',
        [userId, displayName || null]
      );

      // Assign default viewer role
      await query(
        'INSERT INTO user_roles (user_id, role) VALUES ($1, $2)',
        [userId, 'viewer']
      );

      await query('COMMIT');

      // Generate token
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: { id: userId, email, displayName },
        token
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    console.log('🔐 Sign in attempt for:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password } = req.body;

    // Get user with profile
    console.log('🔍 Querying user data for:', email);
    const userResult = await query(
      `SELECT u.id, u.email, u.password_hash, p.display_name,
              COALESCE(
                array_remove(array_agg(ur.role), NULL), 
                '{}'::app_role[]
              ) as roles
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       WHERE u.email = $1
       GROUP BY u.id, u.email, u.password_hash, p.display_name`,
      [email]
    );

    console.log('📊 Query result rows:', userResult.rows.length);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found in database for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    console.log('👤 Found user:', { id: user.id, email: user.email, hasPassword: !!user.password_hash });
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔑 Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    console.log('🔐 Token generated for user:', user.id);
    console.log('👤 User roles from DB:', user.roles);
    console.log('📋 Is array?', Array.isArray(user.roles));
    console.log('📋 Filtered roles:', Array.isArray(user.roles) ? user.roles.filter((role: string) => role !== null) : []);

    res.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        roles: Array.isArray(user.roles) ? user.roles.filter((role: string) => role !== null) : []
      },
      token
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profileResult = await query(
      `SELECT p.*, u.email, 
              COALESCE(
                array_remove(array_agg(ur.role), NULL), 
                '{}'::app_role[]
              ) as roles
       FROM profiles p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN user_roles ur ON p.user_id = ur.user_id
       WHERE p.user_id = $1
       GROUP BY p.id, p.user_id, p.display_name, p.avatar_url, p.created_at, p.updated_at, u.email`,
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const profile = profileResult.rows[0];
    res.json({
      ...profile,
      roles: Array.isArray(profile.roles) ? profile.roles.filter((role: string) => role !== null) : []
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserRoles = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    res.json({
      roles: req.user.roles
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};