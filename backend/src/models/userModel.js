const pool = require('../../db');

const UserModel = {
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT User_ID, name, email, gender, birth, job, status, created_at FROM users WHERE User_ID = ?', [id]);
    return rows[0] || null;
  },

  async create({ name, email, password, gender, birth, job, status }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, gender, birth, job, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, password, gender || null, birth || null, job || null, status || null]
    );
    return result.insertId;
  }
};

module.exports = UserModel;
