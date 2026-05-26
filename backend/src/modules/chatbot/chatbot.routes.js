import express from "express";
import { sendChatbotMessage } from "./chatbot.controller.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", protect, sendChatbotMessage);

export default router;