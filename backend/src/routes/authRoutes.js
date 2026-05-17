import express from 'express';
import { register, login, getProfile, updateProfile, getDashboard, changePassword, getProfileStats } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

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

export default router;