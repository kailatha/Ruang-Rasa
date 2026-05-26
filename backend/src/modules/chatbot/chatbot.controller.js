import prisma from "../../lib/prisma.js";
import {
  detectSafetyRisk,
  buildCrisisResponse,
} from "./safety.guard.js";

import { buildChatbotPrompt } from "./prompt.builder.js";

import { generateGeminiReply } from "./gemini.client.js";
import {
  retrieveRelevantKnowledge,
  formatKnowledgeForPrompt,
} from "./knowledge.service.js";

export async function sendChatbotMessage(req, res, next) {
  try {
    const { message, journalContext, sessionId } = req.body;
    const userId = req.user.id; // Diambil dari token JWT setelah lolos middleware protect

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Field message wajib diisi.",
      });
    }

    // 1. Dapatkan atau Buat ChatSession Baru
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId, userId: userId },
      });
      if (!session) {
        return res.status(404).json({ success: false, message: "Sesi chat tidak ditemukan." });
      }
    } else {
      // Buat sesi baru, judul auto-generate dari 25 karakter awal pesan user
      session = await prisma.chatSession.create({
        data: {
          userId,
          title: message.substring(0, 25) + (message.length > 25 ? "..." : ""),
        },
      });
    }

    // 2. Simpan pesan USER ke database
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: message,
      },
    });

    // 3. Deteksi Risiko Keamanan (Crisis Guard)
    const safety = detectSafetyRisk(message);

    if (safety.shouldStopNormalFlow) {
      const crisisReply = buildCrisisResponse();
      
      // Simpan jawaban Krisis BOT ke database
      await prisma.chatMessage.create({
        data: {
          sessionId: session.id,
          role: "bot",
          content: crisisReply,
          safetyLevel: safety.level,
          source: "crisis",
        },
      });

      return res.json({
        success: true,
        data: {
          sessionId: session.id,
          answer: crisisReply,
          safety_level: safety.level,
          source: "crisis",
        },
      });
    }

    // 4. Proses RAG (Ambil Pengetahuan Pendukung)
    const knowledgeResult = retrieveRelevantKnowledge({
      userMessage: message,
      journalContext,
      limit: 5,
    });
    const knowledgeText = formatKnowledgeForPrompt(knowledgeResult);

    // 5. Bangun Prompt & panggil Gemini AI
    const prompt = buildChatbotPrompt({
      message,
      journalContext,
      knowledgeText,
    });
    const answer = await generateGeminiReply(prompt);

    // 6. Simpan respon BOT ke database
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: "bot",
        content: answer,
        safetyLevel: safety.level,
        source: "gemini",
      },
    });

    return res.json({
      success: true,
      data: {
        sessionId: session.id,
        answer,
        safety_level: safety.level,
        source: "gemini",
        knowledge_used: knowledgeResult.documents.map((doc) => ({
          title: doc.title,
          file: doc.relativePath,
          type: doc.type,
        })),
        inferred_context: knowledgeResult.context,
      },
    });
  } catch (error) {
    next(error);
  }
}