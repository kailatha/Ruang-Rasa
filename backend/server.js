import 'dotenv/config';

import dotenv from "dotenv";
dotenv.config();
console.log("DATABASE_URL =", process.env.DATABASE_URL);
console.log("GEMINI_API_KEY loaded =", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_MODEL =", process.env.GEMINI_MODEL);

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// untuk auth
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

// untuk journal
import journalRoutes from "./src/routes/journalRoutes.js";

app.use("/api/journal", journalRoutes);

// untuk screening
import screeningRoutes from './src/routes/screeningRoutes.js';

app.use('/api/screening', screeningRoutes);

// untuk chatbot
import chatbotRoutes from "./src/modules/chatbot/chatbot.routes.js";

app.use("/api/chatbot", chatbotRoutes);