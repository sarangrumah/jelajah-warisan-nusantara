import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { query } from '../config/database';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

export const signUpValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').optional().isLength({ min: 1, max: 100 })
];

export const signInValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
];

export const changePasswordValidation = [
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirm_password').custom((value, { req }) => value === req.body.new_password)
    .withMessage('Confirmation password must match the new password')
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
        process.env.JWT_SECRET as Secret,
        { expiresIn: '7d' }
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
                array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), 
                ARRAY[]::app_role[]
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
      process.env.JWT_SECRET as Secret,
      { expiresIn: '7d' }
    );

    console.log('🔐 Token generated for user:', user.id);
    console.log('👤 User roles from DB:', user.roles);
    console.log('📋 Is array?', Array.isArray(user.roles));
    
    // Ensure roles is always an array
    let userRoles = [];
    if (Array.isArray(user.roles)) {
      userRoles = user.roles.filter((role: string) => role !== null);
    } else if (user.roles) {
      // Handle PostgreSQL array format like {admin,editor}
      const rolesStr = user.roles.toString();
      if (rolesStr.startsWith('{') && rolesStr.endsWith('}')) {
        userRoles = rolesStr.slice(1, -1).split(',').filter((role: string) => role.trim() !== '');
      }
    }
    
    console.log('📋 Final processed roles:', userRoles);

    res.json({
      message: 'Sign in successful',
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        roles: userRoles
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
                array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), 
                ARRAY[]::app_role[]
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
    
    // Process roles like in other functions
    let userRoles = [];
    if (Array.isArray(profile.roles)) {
      userRoles = profile.roles.filter((role: string) => role !== null);
    } else if (profile.roles) {
      const rolesStr = profile.roles.toString();
      if (rolesStr.startsWith('{') && rolesStr.endsWith('}')) {
        userRoles = rolesStr.slice(1, -1).split(',').filter((role: string) => role.trim() !== '');
      }
    }
    
    res.json({
      ...profile,
      roles: userRoles
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

export const getAllProfile = async (req: AuthRequest, res: Response) => {
  try {

    const profileResult = await query(
      `SELECT p.*, u.email,u.email_verified,
              COALESCE(
                array_agg(ur.role) FILTER (WHERE ur.role IS NOT NULL), 
                ARRAY[]::app_role[]
              ) as roles
      FROM profiles p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN user_roles ur ON p.user_id = ur.user_id
      WHERE p.user_id != $1
      GROUP BY p.id, p.user_id, p.display_name, p.avatar_url, p.created_at, p.updated_at, u.email, u.email_verified`,
      [req.user?.id]
    );

    if (profileResult.rows.length === 0) {
      return res.status(200).json({ data: 'No profiles found' });
    }

    // normalize roles for each profile
    const profiles = profileResult.rows.map((profile: any) => {
      let userRoles: string[] = [];

      if (Array.isArray(profile.roles)) {
        userRoles = profile.roles.filter((role: string) => role !== null);
      } else if (profile.roles) {
        const rolesStr = profile.roles.toString();
        if (rolesStr.startsWith("{") && rolesStr.endsWith("}")) {
          userRoles = rolesStr
            .slice(1, -1)
            .split(",")
            .filter((role: string) => role.trim() !== "");
        }
      }

      return {
        ...profile,
        roles: userRoles,
      };
    });

    res.json(profiles);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { new_password } = req.body;
    const userId = req.user.id;

    const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash } = userResult.rows[0];

    const isSamePassword = await bcrypt.compare(new_password, password_hash);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from the current password' });
    }

    const newHash = await bcrypt.hash(new_password, 12);

    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Password reset validation
export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail()
];

export const resetPasswordValidation = [
  body('token').isLength({ min: 1 }).withMessage('Token is required'),
  body('new_password').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('confirm_password').custom((value, { req }) => value === req.body.new_password)
    .withMessage('Confirmation password must match the new password')
];

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check if user exists
      const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
      
      if (userResult.rows.length === 0) {
        // Don't reveal if user exists or not for security
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      const userId = userResult.rows[0].id;

      // Generate secure reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Delete any existing reset tokens for this user
      await query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);

      // Store new reset token
      await query(
        'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, resetToken, expiresAt]
      );

      // Send password reset email
      const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);

      if (!emailSent) {
        console.error('Failed to send password reset email to:', email);
        return res.status(500).json({ error: 'Failed to send password reset email. Please try again later.' });
      }

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    } catch (dbError) {
      console.error('Database error in forgot password:', dbError);
      // Return success message even if database fails to prevent user enumeration
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const validateResetToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    try {
      const tokenResult = await query(
        'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
        [token]
      );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      res.json({ valid: true });
    } catch (dbError) {
      console.error('Database error in validateResetToken:', dbError);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { token, new_password } = req.body;

    try {
      // Validate token
      const tokenResult = await query(
        'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW() AND used = false',
        [token]
      );

      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      const userId = tokenResult.rows[0].user_id;

      // Check if new password is same as current password
      const userResult = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
      
      if (userResult.rows.length === 0) {
        return res.status(400).json({ error: 'User not found' });
      }

      const { password_hash } = userResult.rows[0];
      const isSamePassword = await bcrypt.compare(new_password, password_hash);
      
      if (isSamePassword) {
        return res.status(400).json({ error: 'New password must be different from current password' });
      }

      // Hash new password
      const newHash = await bcrypt.hash(new_password, 12);

      // Update password
      await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, userId]);

      // Mark token as used
      await query('UPDATE password_reset_tokens SET used = true WHERE token = $1', [token]);

      // Get user email for notification
      const emailResult = await query('SELECT email FROM users WHERE id = $1', [userId]);
      const userEmail = emailResult.rows[0]?.email;

      // Send success notification email
      if (userEmail) {
        await emailService.sendPasswordResetSuccessEmail(userEmail);
      }

      res.json({ message: 'Password reset successfully' });
    } catch (dbError) {
      console.error('Database error in resetPassword:', dbError);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
