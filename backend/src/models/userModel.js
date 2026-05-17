// // import pool from '../config/database.js';
// import { nanoid } from 'nanoid';

// export const createUser = async (userData) => {
//   const { name, email, password, gender, dob, job, status } = userData;
//   const id = `user-${nanoid(16)}`;
//   const query = `
//     INSERT INTO users (user_id, name, email, password, gender, dob, job, status) 
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
//     RETURNING user_id, name, email, gender, dob, job, status, created_at
//   `;
//   const { rows } = await pool.query(query, [id, name, email, password, gender, dob, job, status]);
//   return rows[0];
// };

// export const findUserByEmail = async (email) => {
//   const query = 'SELECT * FROM users WHERE email = $1';
//   const { rows } = await pool.query(query, [email]);
//   return rows[0];
// };

// export const findUserById = async (userId) => {
//   const query = 'SELECT user_id, name, email, gender, dob, job, status, created_at FROM users WHERE user_id = $1';
//   const { rows } = await pool.query(query, [userId]);
//   return rows[0];
// };
// export const updateUser = async (userId, userData) => {
//   const { name, gender, dob, job, status } = userData;
//   const query = `
//     UPDATE users 
//     SET name = $1, gender = $2, dob = $3, job = $4, status = $5 
//     WHERE user_id = $6
//     RETURNING user_id, name, email, gender, dob, job, status, created_at
//   `;
//   const { rows } = await pool.query(query, [name, gender, dob, job, status, userId]);
//   return rows[0];
// };

// src/models/userModel.js

import prisma from "../lib/prisma.js";

// CREATE USER
export const createUser = async (userData) => {
  const { name, email, password, gender, dob, job, status } = userData;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      gender,
      dob: dob ? new Date(dob) : null,
      job,
      status,
    },
  });

  return user;
};

// FIND USER BY EMAIL
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// FIND USER BY ID
export const findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

// UPDATE USER
export const updateUser = async (userId, userData) => {
  const { name, gender, dob, job, status } = userData;

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      gender,
      dob: dob ? new Date(dob) : null,
      job,
      status,
    },
  });
};

// UPDATE PASSWORD
export const updatePassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};