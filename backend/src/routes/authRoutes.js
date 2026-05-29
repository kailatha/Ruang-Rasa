import express from 'express';
import { register, login, getProfile, updateProfile, getDashboard, changePassword, getProfileStats } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Route untuk autentikasi
router.post('/register', register);
router.post('/login', login);

// Route profil (digunakan oleh halaman Edit Profile & Profile)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/profile/stats', protect, getProfileStats);

// Route dashboard
router.get('/dashboard', protect, getDashboard);

// route forgot & reset pass
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;