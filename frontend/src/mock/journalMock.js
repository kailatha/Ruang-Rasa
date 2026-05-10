// mock/journalMock.js
// Pakai ini sementara sambil nunggu backend/DB siap.
// Di journalService.js nanti tinggal swap ke real API.

export const MOCK_ENTRIES = [
  {
    id: "1",
    mood: "Sedih",
    moodEmoji: "😞",
    content:
      "Pagi ini terasa berat, tapi aku coba tetap fokus dan bersyukur untuk hal-hal kecil...",
    tags: ["Pekerjaan", "Harapan"],
    sentiment: { label: "Positif", score: 58 },
    emotion: "Harapan",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 jam lalu
  },
];

export const TAGS_OPTIONS = [
  "Pekerjaan",
  "Keluarga",
  "Kesehatan",
  "Hubungan",
  "Akademik",
];

export const MOODS = [
  { label: "Senang", emoji: "😊" },
  { label: "Netral", emoji: "😐" },
  { label: "Sedih", emoji: "😞" },
  { label: "Marah", emoji: "😠" },
  { label: "Stress", emoji: "😰" },
];