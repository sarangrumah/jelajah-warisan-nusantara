import { Router } from 'express';
import {
  signUp,
  signIn,
  getProfile,
  getUserRoles,
  signUpValidation,
  signInValidation,
  getAllProfile,
  changePassword,
  changePasswordValidation,
  forgotPassword,
  resetPassword,
  validateResetToken,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { passwordResetLimiter, authLimiter } from '../middleware/rateLimit';

const router = Router();

// Public routes
router.post('/signup', authLimiter, signUpValidation, signUp);
router.post('/signin', authLimiter, signInValidation, signIn);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);
router.get('/validate-reset-token/:token', validateResetToken);

// Protected routes
router.get('/profile/:userId', authenticateToken, getProfile);
router.get('/profile', authenticateToken, getAllProfile);
router.get('/roles', authenticateToken, getUserRoles);
router.post('/change-password', authenticateToken, changePasswordValidation, changePassword);

export default router;
