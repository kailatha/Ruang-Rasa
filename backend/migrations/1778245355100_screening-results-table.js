export const up = (pgm) => {
  pgm.createTable('screening_results', {
    id: 'id',
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    // 10 Kolom Pertanyaan dari AI Model
    sleep_hours: { type: 'numeric(4,2)' }, // e.g., 7.5
    screen_time: { type: 'numeric(4,2)' },
    social_media: { type: 'numeric(4,2)' },
    trauma_history: { type: 'integer' }, // 0 atau 1
    previously_diagnosed: { type: 'integer' }, // 0 atau 1 (kolom "Previously" di dataset)
    work_hours: { type: 'integer' },
    work_stress: { type: 'integer' }, // Skala 1-10
    financial_stress: { type: 'integer' }, // Skala 1-10
    mood_swings: { type: 'integer' }, // Skala 1-10
    loneliness: { type: 'integer' }, // Skala 1-10

    // Hasil Akhir
    total_score: { type: 'integer' },
    level: { type: 'varchar(50)' }, // e.g., 'Sedang', 'Berat'
    recommendation: { type: 'text' }, // Pesan atau hasil rekomendasi AI

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('screening_results', 'user_id');
};

export const down = (pgm) => {
  pgm.dropTable('screening_results');
};
