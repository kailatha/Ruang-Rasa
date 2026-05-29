// src/controllers/screeningController.js

import prisma from "../lib/prisma.js";
import { createScreeningResult, getScreeningHistoryByUserId } from '../models/screeningModel.js';

/**
 * Fallback: Mendapatkan kategori dan rekomendasi jika AI Service tidak tersedia
 */
const getFallbackResult = (score) => {
  if (score <= 4) {
    return {
      level: 'Minimal',
      recommendation: 'Tingkat kecemasan Anda tergolong minimal. Tetap jaga kesehatan mental dengan istirahat cukup dan relaksasi.',
      activity: 'Meditasi ringan, membaca buku, atau berjalan santai di taman.'
    };
  } else if (score <= 9) {
    return {
      level: 'Ringan',
      recommendation: 'Anda mengalami kecemasan ringan. Mencoba teknik pernapasan dalam atau meditasi dapat membantu menenangkan pikiran.',
      activity: 'Latihan pernapasan dalam, yoga, atau journaling harian.'
    };
  } else if (score <= 14) {
    return {
      level: 'Sedang',
      recommendation: 'Tingkat kecemasan Anda tergolong sedang. Disarankan untuk berkonsultasi dengan konselor atau psikolog untuk pencegahan lebih lanjut.',
      activity: 'Konsultasi dengan konselor, olahraga rutin, dan teknik relaksasi otot progresif.'
    };
  } else {
    return {
      level: 'Berat',
      recommendation: 'Anda mengalami kecemasan berat. Sangat disarankan untuk segera mencari bantuan profesional (psikolog atau psikiater) untuk penanganan yang tepat.',
      activity: 'Segera hubungi psikolog atau psikiater, hindari isolasi, dan cari dukungan dari orang terdekat.'
    };
  }
};

/**
 * Memanggil AI Service untuk mendapatkan prediksi screening
 * @param {Object} features - Data fitur untuk prediksi
 * @returns {Object|null} - Hasil prediksi AI atau null jika gagal
 */
const callAIService = async (features) => {
  const AI_API_URL = (process.env.AI_API_URL).trim().replace(/\/$/, "");

  try {
    const response = await fetch(`${AI_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features),
      signal: AbortSignal.timeout(10000), // Timeout 10 detik
    });

    if (!response.ok) {
      console.error(`AI Service error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return {
      level: data.level,
      recommendation: data.recommendation,
      activity: data.activity || null,
      affirmation: data.affirmation || null,
      total_score: data.total_score || null,
      user_profile: data.user_profile || null,
      risk_score: data.risk_score || null,
    };
  } catch (error) {
    console.error('AI Service tidak tersedia, menggunakan fallback:', error.message);
    return null;
  }
};

/**
 * POST /api/screening/submit
 * Memproses jawaban screening dan menyimpan hasilnya
 */
export const submitScreening = async (req, res) => {
  try {
    const { answers } = req.body; // answers adalah array angka dari 10 pertanyaan frontend
    const userId = req.user.id;

    // Ambil data user (dob & gender) via Prisma
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: { dob: true, gender: true },
    });

    let user_age = null;
    let user_gender = userData?.gender || null;

    if (userData?.dob) {
      const birthDate = new Date(userData.dob);
      const today = new Date();
      user_age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        user_age--;
      }
    }

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({ message: 'Data screening tidak lengkap (harus 10 jawaban)' });
    }

    // Mapping jawaban dari frontend (index 0-9) ke kolom database
    const [
      sleep_hours, screen_time, social_media, trauma_history, 
      previously_diagnosed, work_hours, work_stress, financial_stress, 
      mood_swings, loneliness
    ] = answers;

    // Hitung total skor (asumsi 1-10 per pertanyaan, max 100)
    const total_score = answers.reduce((acc, curr) => acc + curr, 0);

    // Siapkan data fitur untuk AI Service
    const aiFeatures = {
      user_age,
      user_gender,
      sleep_hours,
      screen_time,
      social_media,
      trauma_history,
      previously_diagnosed,
      work_hours,
      work_stress,
      financial_stress,
      mood_swings,
      loneliness,
    };

    // Panggil AI Service, kalau gagal pakai fallback
    let result = await callAIService(aiFeatures);

    if (!result) {
      console.log('Menggunakan fallback scoring (AI Service tidak tersedia)');
      result = getFallbackResult(total_score / 10);
    }

    // Normalize activity: AI Service bisa return object, Prisma butuh String
    let activityStr = null;
    if (result.activity) {
      if (typeof result.activity === 'string') {
        activityStr = result.activity;
      } else if (typeof result.activity === 'object') {
        activityStr = result.activity.title || result.activity.name || JSON.stringify(result.activity);
      }
    }

    // Simpan ke database via Prisma
    const savedResult = await createScreeningResult({
      userId,
      user_age,
      user_gender,
      sleep_hours,
      screen_time,
      social_media,
      trauma_history,
      previously_diagnosed,
      work_hours,
      work_stress,
      financial_stress,
      mood_swings,
      loneliness,
      total_score: result.total_score || total_score,
      level: result.level,
      recommendation: result.recommendation,
      activity: activityStr,
    });

    res.status(201).json({
      message: 'Screening berhasil disimpan',
      data: {
        ...savedResult,
        activityDetail: result.activity || null,
        affirmation: result.affirmation || null,
        user_profile: result.user_profile || null,
      }
    });
  } catch (error) {
    console.error('Error in submitScreening:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

/**
 * GET /api/screening/history
 * Mengambil riwayat screening user
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await getScreeningHistoryByUserId(userId);

    res.json({
      message: 'Riwayat screening berhasil diambil',
      data: history
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
