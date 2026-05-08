import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, gender, dob, job, status } = req.body;

    // Validasi dasar
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nama, email, dan kata sandi wajib diisi' });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Hash password sebelum disimpan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke database
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      gender,
      dob,
      job,
      status
    });

    // Buat JWT Token
    const token = jwt.sign(
      { id: newUser.user_id }, 
      process.env.JWT_SECRET || 'rahasia_default', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        dob: newUser.dob,
        job: newUser.job,
        status: newUser.status,
        createdAt: newUser.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan kata sandi wajib diisi' });
    }

    // Cari user berdasarkan email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    // Cocokkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau kata sandi salah' });
    }

    // Buat JWT Token
    const token = jwt.sign(
      { id: user.user_id }, 
      process.env.JWT_SECRET || 'rahasia_default', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        job: user.job,
        status: user.status,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    res.json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      job: user.job,
      status: user.status,
      createdAt: user.created_at
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
