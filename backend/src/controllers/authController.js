const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, gender, birth, job, status } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password minimal 6 karakter.' });
      }

      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email sudah terdaftar.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        gender,
        birth,
        job,
        status
      });

      const token = jwt.sign(
        { userId, email, name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registrasi berhasil!',
        token,
        user: { userId, name, email }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi.' });
      }

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Email atau password salah.' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email atau password salah.' });
      }

      const token = jwt.sign(
        { userId: user.User_ID, email: user.email, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login berhasil!',
        token,
        user: {
          userId: user.User_ID,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan.' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
  }
};

module.exports = authController;
