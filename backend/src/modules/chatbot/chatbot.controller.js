import {
  detectSafetyRisk,
  buildCrisisResponse,
} from "./safety.guard.js";
import { buildChatbotPrompt } from "./prompt.builder.js";
import { generateGeminiReply } from "./gemini.client.js";

export async function sendChatbotMessage(req, res, next) {
  try {
    const { message } = req.body;

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

    const prompt = buildChatbotPrompt(message);
    const answer = await generateGeminiReply(prompt);

    return res.json({
      success: true,
      data: {
        answer,
        safety_level: safety.level,
        source: "gemini",
      },
    });
  } catch (error) {
    next(error);
  }
}