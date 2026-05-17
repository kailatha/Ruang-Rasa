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