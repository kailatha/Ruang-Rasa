import { createScreeningResult, getScreeningHistoryByUserId } from '../models/screeningModel.js';

/**
 * Mendapatkan kategori dan rekomendasi berdasarkan skor GAD-7
 */
const getGAD7Result = (score) => {
  if (score <= 4) {
    return {
      level: 'Minimal',
      recommendation: 'Tingkat kecemasan Anda tergolong minimal. Tetap jaga kesehatan mental dengan istirahat cukup dan relaksasi.'
    };
  } else if (score <= 9) {
    return {
      level: 'Ringan',
      recommendation: 'Anda mengalami kecemasan ringan. Mencoba teknik pernapasan dalam atau meditasi dapat membantu menenangkan pikiran.'
    };
  } else if (score <= 14) {
    return {
      level: 'Sedang',
      recommendation: 'Tingkat kecemasan Anda tergolong sedang. Disarankan untuk berkonsultasi dengan konselor atau psikolog untuk pencegahan lebih lanjut.'
    };
  } else {
    return {
      level: 'Berat',
      recommendation: 'Anda mengalami kecemasan berat. Sangat disarankan untuk segera mencari bantuan profesional (psikolog atau psikiater) untuk penanganan yang tepat.'
    };
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

    // Tentukan hasil sementara (Nanti bisa diganti dengan response dari API Python AI)
    let result = getGAD7Result(total_score / 10); // Normalisasi sementara agar cocok dengan logika lama

    // Simpan ke database
    const savedResult = await createScreeningResult({
      userId,
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
      total_score,
      level: result.level,
      recommendation: result.recommendation
    });

    res.status(201).json({
      message: 'Screening berhasil disimpan',
      data: savedResult
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
