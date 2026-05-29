import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, updateUser, updatePassword } from '../models/userModel.js';
import prisma from '../lib/prisma.js';

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
      { id: newUser.id }, 
      process.env.JWT_SECRET || 'rahasia_default', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        dob: newUser.dob,
        job: newUser.job,
        status: newUser.status,
        avatarUrl: newUser.avatarUrl,
        createdAt: newUser.createdAt
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
      { id: user.id }, 
      process.env.JWT_SECRET || 'rahasia_default', 
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        job: user.job,
        status: user.status,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
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
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      job: user.job,
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
      const { name, gender, dob, job, status, avatarUrl } = req.body;
    
    const updatedUser = await updateUser(req.user.id, {
      name,
      gender,
      dob,
      job,
      status,
      avatarUrl
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.json({
      message: 'Profil berhasil diperbarui',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        job: updatedUser.job,
        status: updatedUser.status,
        avatarUrl: updatedUser.avatarUrl,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    
    // Nanti bisa ditambahkan summary jumlah jurnal, riwayat screening, dll
    res.json({
      message: 'Data dashboard berhasil diambil',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan password baru wajib diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
    }

    // Ambil user dengan password
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password lama tidak sesuai' });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await updatePassword(req.user.id, hashedPassword);

    res.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};

export const getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [screeningCount, journalCount] = await Promise.all([
      prisma.screeningResult.count({ where: { userId } }),
      prisma.journal.count({ where: { userId } }),
    ]);

    res.json({
      screeningCount,
      journalCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
