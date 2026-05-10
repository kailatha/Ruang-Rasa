// src/routes/journalRoutes.js
import express from "express";
import {
  getEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/journalController.js";
import { authenticate } from "../middleware/authMiddleware.js"; // middleware auth yang sudah ada

const router = express.Router();

// Semua route journal wajib authenticated
router.use(authenticate);

/**
 * @route   GET /api/journal
 * @desc    Ambil semua entri jurnal milik user
 * @access  Private
 * 
 * Postman: GET http://localhost:3000/api/journal
 * Headers: Authorization: Bearer <token>
 */
router.get("/", getEntries);

/**
 * @route   GET /api/journal/:id
 * @desc    Ambil satu entri jurnal
 * @access  Private
 */
router.get("/:id", getEntry);

/**
 * @route   POST /api/journal
 * @desc    Buat entri jurnal baru
 * @access  Private
 * 
 * Postman body (JSON):
 * {
 *   "mood": "Senang",
 *   "content": "Hari ini menyenangkan...",
 *   "tags": ["Pekerjaan", "Keluarga"]
 * }
 */
router.post("/", createEntry);

/**
 * @route   PUT /api/journal/:id
 * @desc    Update entri jurnal
 * @access  Private
 */
router.put("/:id", updateEntry);

/**
 * @route   DELETE /api/journal/:id
 * @desc    Hapus entri jurnal
 * @access  Private
 */
router.delete("/:id", deleteEntry);

export default router;