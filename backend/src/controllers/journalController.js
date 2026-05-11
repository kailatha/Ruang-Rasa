// src/controllers/journalController.js

/**
 * Journal Controller
 * 
 * Postman test endpoints:
 *   GET    /api/journal          → getEntries
 *   GET    /api/journal/:id      → getEntry
 *   POST   /api/journal          → createEntry
 *   PUT    /api/journal/:id      → updateEntry
 *   DELETE /api/journal/:id      → deleteEntry
 * 
 * All routes require Authorization: Bearer <token>
 */

// ─── GET /api/journal ────────────────────────────────────────────────────────
export async function getEntries(req, res) {
  try {
    const userId = req.user.id; // dari middleware auth

    // TODO: ganti dengan query PostgreSQL
    // const entries = await Journal.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });

    // Placeholder response untuk test Postman
    res.status(200).json({
      success: true,
      entries: [],
      meta: {
        total: 0,
        thisMonth: 0,
      },
    });
  } catch (err) {
    console.error("[journalController] getEntries:", err);
    res.status(500).json({ success: false, message: "Gagal memuat entri." });
  }
}

// ─── GET /api/journal/:id ────────────────────────────────────────────────────
export async function getEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // TODO: const entry = await Journal.findOne({ where: { id, userId } });
    // if (!entry) return res.status(404).json({ success: false, message: "Entri tidak ditemukan." });

    res.status(200).json({
      success: true,
      entry: null, // ganti dengan data dari DB
    });
  } catch (err) {
    console.error("[journalController] getEntry:", err);
    res.status(500).json({ success: false, message: "Gagal memuat entri." });
  }
}

// ─── POST /api/journal ───────────────────────────────────────────────────────
export async function createEntry(req, res) {
  try {
    const userId = req.user.id;
    const { mood, content, tags = [] } = req.body;

    // Validasi
    if (!mood || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mood dan konten jurnal wajib diisi.",
      });
    }

    const validMoods = ["Senang", "Netral", "Sedih", "Marah", "Stress"];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: `Mood tidak valid. Pilih dari: ${validMoods.join(", ")}`,
      });
    }

    // TODO: Simpan ke PostgreSQL
    // const entry = await Journal.create({ userId, mood, content, tags });

    // TODO: Opsional — panggil AI untuk analisis sentimen
    // const sentiment = await analyzeSentiment(content);
    // await entry.update({ sentiment });

    res.status(201).json({
      success: true,
      message: "Jurnal berhasil disimpan.",
      entry: {
        id: "placeholder-id",
        userId,
        mood,
        content,
        tags,
        sentiment: null, // akan diisi setelah AI analysis
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[journalController] createEntry:", err);
    res.status(500).json({ success: false, message: "Gagal menyimpan jurnal." });
  }
}

// ─── PUT /api/journal/:id ────────────────────────────────────────────────────
export async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { mood, content, tags } = req.body;

    // TODO:
    // const entry = await Journal.findOne({ where: { id, userId } });
    // if (!entry) return res.status(404).json({ success: false, message: "Entri tidak ditemukan." });
    // await entry.update({ mood, content, tags });

    res.status(200).json({
      success: true,
      message: "Jurnal berhasil diperbarui.",
      entry: { id, mood, content, tags, updatedAt: new Date().toISOString() },
    });
  } catch (err) {
    console.error("[journalController] updateEntry:", err);
    res.status(500).json({ success: false, message: "Gagal memperbarui jurnal." });
  }
}

// ─── DELETE /api/journal/:id ─────────────────────────────────────────────────
export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // TODO:
    // const entry = await Journal.findOne({ where: { id, userId } });
    // if (!entry) return res.status(404).json({ success: false, message: "Entri tidak ditemukan." });
    // await entry.destroy();

    res.status(200).json({
      success: true,
      message: "Jurnal berhasil dihapus.",
    });
  } catch (err) {
    console.error("[journalController] deleteEntry:", err);
    res.status(500).json({ success: false, message: "Gagal menghapus jurnal." });
  }
}