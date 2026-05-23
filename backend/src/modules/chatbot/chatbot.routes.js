import express from "express";
import { sendChatbotMessage } from "./chatbot.controller.js";

const router = express.Router();

router.post("/message", sendChatbotMessage);

export default router;