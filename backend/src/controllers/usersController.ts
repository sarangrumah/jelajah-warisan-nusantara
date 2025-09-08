import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';

export const createUserValidation = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('display_name').optional().isLength({ min: 1, max: 100 }),
  body('role').optional().isIn(['viewer', 'approver', 'admin', 'super-admin']).withMessage('Invalid role')
];

export const createUser = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { email, password, display_name, role } = req.body as {
      email: string;
      password: string;
      display_name?: string;
      role?: 'viewer' | 'approver' | 'admin' | 'super-admin';
    };

    const passwordHash = await bcrypt.hash(password, 12);

    // Upsert user by email and return the user id (handles existing users too)
    const userResult = await query(
      `INSERT INTO users (id, email, password_hash, email_verified, created_at)
       VALUES ($1, $2, $3, true, NOW())
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         email_verified = EXCLUDED.email_verified,
         updated_at = NOW()
       RETURNING id`,
      [uuidv4(), email, passwordHash]
    );

    const userId: string = userResult.rows[0].id;

    // Ensure profile exists/updated
    await query(
      `INSERT INTO profiles (user_id, display_name, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         display_name = EXCLUDED.display_name,
         updated_at = NOW()`,
      [userId, display_name || null]
    );

    // Assign role (default viewer) using upsert to avoid duplicates
    const roleToAssign = role || 'viewer';
    await query(
      `INSERT INTO user_roles (user_id, role, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, role) DO NOTHING`,
      [userId, roleToAssign]
    );

    return res.status(201).json({
      message: 'User created successfully',
      id: userId,
      email,
      display_name: display_name || null,
      role: roleToAssign
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  if (!id) return res.status(400).json({ error: 'User id is required' });
  try {
    // Remove related rows first, then the user
    await query('BEGIN');
    await query('DELETE FROM user_roles WHERE user_id = $1', [id]);
    await query('DELETE FROM profiles WHERE user_id = $1', [id]);
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    await query('COMMIT');
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User deleted', id });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Delete user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { email, display_name } = req.body as { email?: string; display_name?: string };
  if (!id) return res.status(400).json({ error: 'User id is required' });
  if (!email && !display_name) return res.status(400).json({ error: 'No fields to update' });
  try {
    await query('BEGIN');
    if (email) {
      await query('UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2', [email, id]);
    }
    if (display_name !== undefined) {
      await query(
        `INSERT INTO profiles (user_id, display_name, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name, updated_at = NOW()`,
        [id, display_name]
      );
    }
    await query('COMMIT');
    return res.json({ message: 'User updated' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Update user error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const setUserActive = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { active } = req.body as { active: boolean };
  if (typeof active !== 'boolean') return res.status(400).json({ error: 'active boolean required' });
  try {
    const result = await query('UPDATE users SET email_verified = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email_verified', [active, id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'User status updated', id, active: result.rows[0].email_verified });
  } catch (error) {
    console.error('Set user active error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
