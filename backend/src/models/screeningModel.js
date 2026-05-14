import pool from '../config/database.js';

/**
 * Simpan hasil screening ke database
 */
export const createScreeningResult = async (data) => {
  const { 
    userId, user_age, user_gender, sleep_hours, screen_time, social_media, 
    trauma_history, previously_diagnosed, work_hours, work_stress, 
    financial_stress, mood_swings, loneliness, total_score, level, recommendation 
  } = data;
  
  const query = `
    INSERT INTO screening_results (
      user_id, user_age, user_gender, sleep_hours, screen_time, social_media, 
      trauma_history, previously_diagnosed, work_hours, work_stress, 
      financial_stress, mood_swings, loneliness, total_score, level, recommendation
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [
    userId, user_age, user_gender, sleep_hours, screen_time, social_media, 
    trauma_history, previously_diagnosed, work_hours, work_stress, 
    financial_stress, mood_swings, loneliness, total_score, level, recommendation
  ]);
  
  return rows[0];
};

/**
 * Ambil riwayat screening berdasarkan user_id
 */
export const getScreeningHistoryByUserId = async (userId) => {
  const query = `
    SELECT * FROM screening_results 
    WHERE user_id = $1 
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

/**
 * Ambil hasil screening terbaru untuk user
 */
export const getLatestScreeningByUserId = async (userId) => {
  const query = `
    SELECT * FROM screening_results 
    WHERE user_id = $1 
    ORDER BY created_at DESC 
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};
