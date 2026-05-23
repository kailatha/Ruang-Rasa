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
    const { message, journalContext } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Field message wajib diisi.",
      });
    }

    const safety = detectSafetyRisk(message);

    if (safety.shouldStopNormalFlow) {
      return res.json({
        success: true,
        data: buildCrisisResponse(),
      });
    }

    const knowledgeResult = retrieveRelevantKnowledge({
      userMessage: message,
      journalContext,
      limit: 5,
    });

    const knowledgeText = formatKnowledgeForPrompt(knowledgeResult);

    const prompt = buildChatbotPrompt({
      message,
      journalContext,
      knowledgeText,
    });

    const answer = await generateGeminiReply(prompt);

    return res.json({
      success: true,
      data: {
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