import { Router } from 'express';
import { signUp, signIn, getProfile, signUpValidation, signInValidation } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/signup', signUpValidation, signUp);
router.post('/signin', signInValidation, signIn);

// Protected routes
router.get('/profile/:userId', authenticateToken, getProfile);

export default router;