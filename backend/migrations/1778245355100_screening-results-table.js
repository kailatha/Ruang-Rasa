export const up = (pgm) => {
  pgm.createTable('screening_results', {
    id: 'id',
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    // Data Statis yang diambil dari tabel Users saat screening dilakukan
    user_age: { type: 'integer' }, // Dihitung dari users.dob
    user_gender: { type: 'varchar(20)' }, // Diambil dari users.gender

    // 10 Kolom Pertanyaan dari AI Model
    sleep_hours: { type: 'numeric(4,2)' },
    screen_time: { type: 'numeric(4,2)' },
    social_media: { type: 'numeric(4,2)' },
    trauma_history: { type: 'integer' }, 
    previously_diagnosed: { type: 'integer' }, 
    work_hours: { type: 'integer' },
    work_stress: { type: 'integer' }, 
    financial_stress: { type: 'integer' }, 
    mood_swings: { type: 'integer' }, 
    loneliness: { type: 'integer' },

    // Hasil Akhir
    total_score: { type: 'integer' },
    level: { type: 'varchar(50)' }, 
    recommendation: { type: 'text' },
    activity: { type: 'varchar(200)' },

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