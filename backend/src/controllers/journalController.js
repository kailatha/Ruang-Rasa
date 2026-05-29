// src/controllers/journalController.js

import prisma from "../lib/prisma.js";

// ─── GET ALL ENTRIES ─────────────────────────────────────────────
export async function getEntries(req, res) {
  try {
    const userId = req.user.id;

    const entries = await prisma.journal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // statistik bulan ini
    const now = new Date();

    const firstDayMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const thisMonthCount = entries.filter(
      (entry) => new Date(entry.createdAt) >= firstDayMonth
    ).length;

    res.status(200).json({
      success: true,
      entries,
      meta: {
        total: entries.length,
        thisMonth: thisMonthCount,
      },
    });
  } catch (err) {
    console.error("[journalController] getEntries:", err);

    res.status(500).json({
      success: false,
      message: "Gagal memuat entri jurnal.",
    });
  }
}

// ─── ANALYZE EXISTING ENTRY ─────────────────────────────────────
export async function analyzeEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await prisma.journal.findFirst({ where: { id, userId } });

    if (!entry) {
      return res.status(404).json({ success: false, message: "Entri tidak ditemukan." });
    }

    const aiUrl = (process.env.AI_API_URL || "http://localhost:8000").replace(/\/$/, "") + "/journal/analyze";

    try {
      const aiRes = await fetch(aiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entry.content }),
      });

      if (!aiRes.ok) {
        console.warn("AI service returned non-OK", await aiRes.text());
        return res.status(502).json({ success: false, message: "AI service error" });
      }

      const aiData = await aiRes.json();

      // derive sentiment_label if missing
      let sentimentLabel = aiData.sentiment_label || aiData.sentiment || null;
      if (!sentimentLabel && typeof aiData.sentiment_score === "number") {
        const s = aiData.sentiment_score;
        sentimentLabel = s >= 0.55 ? "positive" : s <= 0.45 ? "negative" : "neutral";
      }

      const updated = await prisma.journal.update({
        where: { id },
        data: {
          emotion: aiData.emotion || null,
          sentiment_label: sentimentLabel,
          sentiment_score: aiData.sentiment_score || null,
          confidence: aiData.confidence || null,
          analysis: aiData,
        },
      });

      res.status(200).json({ success: true, message: "Analisis berhasil diperbarui.", entry: updated });
    } catch (err) {
      console.warn("Failed to call AI service:", err.message || err);
      res.status(500).json({ success: false, message: "Gagal memanggil AI service." });
    }
  } catch (err) {
    console.error("[journalController] analyzeEntry:", err);
    res.status(500).json({ success: false, message: "Gagal menganalisis entri." });
  }
}

// ─── GET SINGLE ENTRY ────────────────────────────────────────────
export async function getEntry(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const entry = await prisma.journal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Entri tidak ditemukan.",
      });
    }

    res.status(200).json({
      success: true,
      entry,
    });
  } catch (err) {
    console.error("[journalController] getEntry:", err);

    res.status(500).json({
      success: false,
      message: "Gagal memuat entri.",
    });
  }
}

// ─── CREATE ENTRY ────────────────────────────────────────────────
export async function createEntry(req, res) {
  try {
    const userId = req.user.id;

    const { mood, content, tags = [] } = req.body;

    // validasi kosong
    if (!mood || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Mood dan konten jurnal wajib diisi.",
      });
    }

    // validasi mood
    const validMoods = [
      "Senang",
      "Netral",
      "Sedih",
      "Marah",
      "Stress",
    ];

    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Mood tidak valid.",
      });
    }

    // simpan ke database
    const entry = await prisma.journal.create({
      data: {
        userId,
        mood,
        content: content.trim(),
        tags,
      },
    });

    // Attempt to call AI Service to analyze the journal and save analysis back to DB
    try {
      const aiUrl = (process.env.AI_API_URL).trim().replace(/\/$/, "") + "/journal/analyze";

      const aiRes = await fetch(aiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content.trim() }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();

        // derive sentiment_label if missing
        let sentimentLabel = aiData.sentiment_label || aiData.sentiment || null;
        if (!sentimentLabel && typeof aiData.sentiment_score === "number") {
          const s = aiData.sentiment_score;
          sentimentLabel = s >= 0.55 ? "positive" : s <= 0.45 ? "negative" : "neutral";
        }

        // update journal with analysis
        const updated = await prisma.journal.update({
          where: { id: entry.id },
          data: {
            emotion: aiData.emotion || aiData.prediction?.emotion || null,
            sentiment_label: sentimentLabel,
            sentiment_score: aiData.sentiment_score || aiData.prediction?.sentiment_score || null,
            confidence: aiData.confidence || aiData.prediction?.confidence || null,
            analysis: aiData,
          },
        });

        res.status(201).json({ success: true, message: "Jurnal berhasil disimpan.", entry: updated });
        return;
      } else {
        console.warn("AI service returned non-OK", await aiRes.text());
      }
    } catch (err) {
      console.warn("Failed to call AI service:", err.message || err);
    }

    // Fallback: return the created entry even if AI analysis failed
    res.status(201).json({
      success: true,
      message: "Jurnal berhasil disimpan.",
      entry,
    });
  } catch (err) {
    console.error("[journalController] createEntry:", err);

    res.status(500).json({
      success: false,
      message: "Gagal menyimpan jurnal.",
    });
  }
}

// ─── UPDATE ENTRY ────────────────────────────────────────────────
export async function updateEntry(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const { mood, content, tags } = req.body;

    // cek entry
    const existingEntry = await prisma.journal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: "Entri tidak ditemukan.",
      });
    }

    // update
    const updatedEntry = await prisma.journal.update({
      where: {
        id,
      },
      // data: {
      //   mood,
      //   content,
      //   tags,
      // },
      data: {
        ...(mood && { mood }),
        ...(content && { content: content.trim() }),
        ...(tags && { tags }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Jurnal berhasil diperbarui.",
      entry: updatedEntry,
    });
  } catch (err) {
    console.error("[journalController] updateEntry:", err);

    res.status(500).json({
      success: false,
      message: "Gagal memperbarui jurnal.",
    });
  }
}

// ─── DELETE ENTRY ────────────────────────────────────────────────
export async function deleteEntry(req, res) {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    // cek entry
    const existingEntry = await prisma.journal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        message: "Entri tidak ditemukan.",
      });
    }

    // delete
    await prisma.journal.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Jurnal berhasil dihapus.",
    });
  } catch (err) {
    console.error("[journalController] deleteEntry:", err);

    res.status(500).json({
      success: false,
      message: "Gagal menghapus jurnal.",
    });
  }
}