import express from 'express';
import { submitScreening, getHistory } from '../controllers/screeningController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Wajib login untuk akses screening

router.post('/submit', submitScreening); // Endpoint untuk mengirim jawaban
router.get('/history', getHistory);      // Endpoint untuk melihat riwayat tes

export default router;
