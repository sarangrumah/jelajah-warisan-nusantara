import { Router } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { createUser, createUserValidation, deleteUser, updateUser, setUserActive } from '../controllers/usersController';

const router = Router();

// Only super-admin can create users
router.post('/', authenticateToken, requireRole(['super-admin']), createUserValidation, createUser);

// Super-admin can delete users
router.delete('/:id', authenticateToken, requireRole(['super-admin']), deleteUser);

// Super-admin can update user email/display_name
router.put('/:id', authenticateToken, requireRole(['super-admin']), updateUser);

// Super-admin can activate/deactivate user (use email_verified flag)
router.post('/:id/active', authenticateToken, requireRole(['super-admin']), setUserActive);

export default router;
