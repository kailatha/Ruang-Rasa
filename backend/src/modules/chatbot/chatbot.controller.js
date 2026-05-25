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

import {
  getUserChatbotContext,
} from "./user-context.service.js";

export async function sendChatbotMessage(req, res, next) {
  try {
    const { message } = req.body;

    const userId = req.user?.id || null;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Field message wajib diisi.",
      });
    }

    /*
      Ambil konteks otomatis dari database
    */

    const journalContext =
      await getUserChatbotContext(userId)
      || null;

    /*
      Safety check
    */

    const safety = detectSafetyRisk(message);

    if (safety.shouldStopNormalFlow) {
      return res.json({
        success: true,
        data: buildCrisisResponse(),
      });
    }

    /*
      Retrieval knowledge
    */

    const knowledgeResult =
      retrieveRelevantKnowledge({
        userMessage: message,
        journalContext,
        limit: 5,
      });

    const knowledgeText =
      formatKnowledgeForPrompt(
        knowledgeResult
      );

    /*
      Build prompt
    */

    const prompt = buildChatbotPrompt({
      message,
      journalContext,
      knowledgeText,
    });

    /*
      Generate Gemini response
    */

    const answer =
      await generateGeminiReply(prompt);

    /*
      TODO:
      simpan chat history ke database
    */

    return res.json({
      success: true,
      data: {
        answer,
        safety_level: safety.level,
        source: "gemini",

        knowledge_used:
          knowledgeResult.documents.map(
            (doc) => ({
              title: doc.title,
              file: doc.relativePath,
              type: doc.type,
            })
          ),

        inferred_context:
          knowledgeResult.context,
      },
    });
  } catch (error) {
    next(error);
  }
}