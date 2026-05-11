import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route untuk autentikasi
router.post('/register', register);
router.post('/login', login);

// Harusnya ke dashboard tapi sementara belom dulu
router.get('/profile', protect, getProfile);

export default router;