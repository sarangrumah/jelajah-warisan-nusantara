import { Router } from 'express';
import { signUp, signIn, getProfile, getUserRoles, signUpValidation, signInValidation, getAllProfile, changePassword, changePasswordValidation } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', signUpValidation, signUp);
router.post('/signin', signInValidation, signIn);

// Protected routes
router.get('/profile/:userId', authenticateToken, getProfile);
router.get('/profile', authenticateToken, getAllProfile);
router.get('/roles', authenticateToken, getUserRoles);
router.post('/change-password', authenticateToken, changePasswordValidation, changePassword);

export default router;
