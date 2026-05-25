// src/modules/chatbot/user-context.service.js

import prisma from "../../lib/prisma.js";

/*
  Tujuan:
  Mengambil konteks user terbaru untuk chatbot:
  - latest journal
  - latest mood check-in
*/
export async function getUserChatbotContext(userId) {
  if (!userId) {
    return null;
  }

  const latestJournal = await prisma.journal.findFirst({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestJournal) {
    return null;
  }

  return {
    latest_journal_context: {
      id: latestJournal.id,
      mood: latestJournal.mood,
      content: latestJournal.content,
      tags: latestJournal.tags,
      created_at: latestJournal.createdAt,
    },
  };
}