import pg from 'pg';

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.query('SELECT NOW()')
  .then(() => console.log('PostgreSQL connected'))
  .catch((err) => console.error('PostgreSQL connection error:', err.message));

export default pool;
