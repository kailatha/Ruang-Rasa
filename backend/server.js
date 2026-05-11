import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import authRoutes from './src/routes/authRoutes.js';

app.use('/api', authRoutes); // Menggunakan awalan /api untuk route autentikasi

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Ruang-Rasa API is running',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import journalRoutes from "./src/routes/journalRoutes.js";

app.use("/api/journal", journalRoutes);
 
