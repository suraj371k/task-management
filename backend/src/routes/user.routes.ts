import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  profile,
  logout,
} from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile' , authMiddleware , profile)
router.post('/logout' , authMiddleware , logout)

export default router;