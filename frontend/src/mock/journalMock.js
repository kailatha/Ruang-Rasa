// mock/dummy sj sementara sambil nunggu backend jd.
// di journalService.js nanti tinggal swap ke real API.

export const MOCK_ENTRIES = [
  {
    id: "1",
    mood: "Stress",
    moodEmoji: "�",
    content:
      "Sy stres ngerjain ini tolong bantu sy",
    tags: ["Akademik"],
    sentiment: { label: "Negatif", score: 58 },
    emotion: "Harapan",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 jam lalu
  },
];
