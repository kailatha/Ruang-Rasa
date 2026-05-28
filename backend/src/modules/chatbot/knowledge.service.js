import fs from "fs";
import path from "path";
import matter from "gray-matter";

const KNOWLEDGE_DIR = path.resolve(process.cwd(), "knowledge");

const REQUIRED_CORE_FILES = [
  "00-safety-boundary.md",
  "01-journaling-context-policy.md",
  "02-emotion-map.md",
  "03-intensity-response-rule.md",
  "04-intervention-library.md",
];

const EMOTION_KEYWORDS = {
  Sadness: [
    "sedih",
    "nangis",
    "menangis",
    "hampa",
    "kosong",
    "kecewa",
    "lelah",
    "capek",
    "sendirian",
    "kesepian",
    "gagal",
    "putus asa",
    "tidak berharga",
    "cape",
    "capek",
    "cape banget"
  ],
  Fear: [
    "cemas",
    "takut",
    "khawatir",
    "gelisah",
    "panik",
    "overthinking",
    "deg-degan",
    "tidak tenang",
    "takut gagal",
    "takut salah",
  ],
  Anger: [
    "marah",
    "kesal",
    "emosi",
    "jengkel",
    "benci",
    "muak",
    "tidak adil",
    "tersinggung",
    "ingin membalas",
  ],
  Neutral: [
    "biasa saja",
    "netral",
    "datar",
    "bingung",
    "tidak tahu",
    "kosong",
    "belum jelas",
  ],
  Joy: [
    "senang",
    "bahagia",
    "lega",
    "bersyukur",
    "puas",
    "bangga",
    "semangat",
    "seneng",
    "happy",
    "excited",
    "hore",
    "asyik",
    "seruuu",
    "gembira",
    "lega banget",
    "akhirnya",
    "alhamdulillah",
    "seneng banget",
  ],
  Love: [
    "sayang",
    "cinta",
    "hangat",
    "terhubung",
    "didukung",
    "dekat",
    "dihargai",
  ],
};

const INTENSITY_KEYWORDS = {
  ringan: ["sedikit", "agak", "mulai", "kadang", "lumayan"],
  sedang: ["cukup", "sering", "terasa", "mengganggu", "kepikiran"],
  berat: [
    "berat",
    "banget",
    "sangat",
    "capek banget",
    "tidak kuat",
    "kewalahan",
    "hancur",
  ],
  "sangat berat": [
    "tidak sanggup",
    "tidak tahan",
    "semua percuma",
    "ingin mati",
    "mau mati",
    "bunuh diri",
    "menyakiti diri",
    "mengakhiri hidup",
  ],
};

const SAFETY_KEYWORDS = [
  "bunuh diri",
  "ingin mati",
  "pengen mati",
  "mau mati",
  "mengakhiri hidup",
  "menyakiti diri",
  "melukai diri",
  "self harm",
  "suicide",
  "tidak mau hidup",
  "tidak sanggup hidup",
  "semua percuma",
  "melukai orang",
  "membunuh orang",
  "tidak aman",
  "diancam",
  "dipukul",
  "kekerasan",
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(" ")
    .filter(Boolean);
}

function safeReadDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(
      `Folder knowledge tidak ditemukan: ${dirPath}. Pastikan folder backend/knowledge/ruang-rasa sudah dibuat.`
    );
  }

  return fs.readdirSync(dirPath, { withFileTypes: true });
}

function getMarkdownFilesRecursive(dirPath) {
  const entries = safeReadDirectory(dirPath);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFilesRecursive(fullPath));
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export function loadKnowledgeDocuments() {
  const markdownFiles = getMarkdownFilesRecursive(KNOWLEDGE_DIR);

  return markdownFiles.map((fullPath) => {
    const raw = fs.readFileSync(fullPath, "utf-8");
    const parsed = matter(raw);

    const relativePath = path
      .relative(KNOWLEDGE_DIR, fullPath)
      .replaceAll("\\", "/");

    const fileName = path.basename(fullPath);

    return {
      id: parsed.data?.id || fileName.replace(".md", ""),
      fileName,
      relativePath,
      title: parsed.data?.title || fileName,
      type: parsed.data?.type || parsed.data?.category || "knowledge",
      priority: parsed.data?.priority || "normal",
      metadata: parsed.data || {},
      content: parsed.content.trim(),
      raw,
    };
  });
}

function getCoreDocuments(documents) {
  return REQUIRED_CORE_FILES.map((fileName) =>
    documents.find((doc) => doc.fileName === fileName)
  ).filter(Boolean);
}

function detectSafetyFromText(userMessage = "") {
  const text = normalizeText(userMessage);

  const matchedKeywords = SAFETY_KEYWORDS.filter((keyword) =>
    text.includes(normalizeText(keyword))
  );

  return {
    hasSafetyRisk: matchedKeywords.length > 0,
    matchedKeywords,
  };
}

function inferEmotionFromMessage(userMessage = "") {
  const text = normalizeText(userMessage);
  const scores = {};

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    scores[emotion] = keywords.reduce((score, keyword) => {
      return text.includes(normalizeText(keyword)) ? score + 1 : score;
    }, 0);
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [emotion, score] = sorted[0];

  return score > 0 ? emotion : null;
}

function inferIntensityFromMessage(userMessage = "") {
  const text = normalizeText(userMessage);
  const scores = {};

  for (const [intensity, keywords] of Object.entries(INTENSITY_KEYWORDS)) {
    scores[intensity] = keywords.reduce((score, keyword) => {
      return text.includes(normalizeText(keyword)) ? score + 1 : score;
    }, 0);
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [intensity, score] = sorted[0];

  return score > 0 ? intensity : null;
}

function getJournalContextValue(journalContext, key) {
  if (!journalContext) return null;

  return (
    journalContext?.[key] ||
    journalContext?.prediction?.[key] ||
    journalContext?.latest_journal_context?.[key] ||
    null
  );
}

function getSafetyLevelFromJournalContext(journalContext) {
  if (!journalContext) return null;

  return (
    journalContext?.safety_level ||
    journalContext?.safetyCheck?.level_label ||
    journalContext?.safety_check?.response?.level_label ||
    journalContext?.latest_journal_context?.safety_level ||
    null
  );
}

function getBlockRecommendFromJournalContext(journalContext) {
  if (!journalContext) return false;

  return Boolean(
    journalContext?.block_recommend ||
      journalContext?.safetyCheck?.block_recommend ||
      journalContext?.safety_check?.response?.block_recommend ||
      journalContext?.latest_journal_context?.block_recommend
  );
}

function buildRetrievalQuery({ userMessage, journalContext }) {
  const emotion =
    getJournalContextValue(journalContext, "emotion") ||
    inferEmotionFromMessage(userMessage);

  const intensity =
    getJournalContextValue(journalContext, "intensity_label") ||
    inferIntensityFromMessage(userMessage);

  const sentiment =
    getJournalContextValue(journalContext, "sentiment_label") || "";

  const safetyLevel = getSafetyLevelFromJournalContext(journalContext) || "";

  const recommendedActivities =
    journalContext?.recommendation?.recommended_activities ||
    journalContext?.recommended_activities ||
    journalContext?.latest_journal_context?.recommended_activities ||
    [];

  const queryParts = [
    userMessage,
    emotion,
    intensity,
    sentiment,
    safetyLevel,
    Array.isArray(recommendedActivities)
      ? recommendedActivities.join(" ")
      : "",
  ];

  return normalizeText(queryParts.filter(Boolean).join(" "));
}

function scoreDocument(doc, retrievalQuery, context = {}) {
  const queryTokens = tokenize(retrievalQuery);

  const docText = normalizeText(
    [
      doc.id,
      doc.fileName,
      doc.title,
      doc.type,
      JSON.stringify(doc.metadata),
      doc.content,
    ].join(" ")
  );

  let score = 0;

  for (const token of queryTokens) {
    if (token.length < 3) continue;

    const occurrences = docText.split(token).length - 1;
    score += occurrences;
  }

  const emotion = context.emotion;
  const intensity = context.intensity;
  const safetyLevel = context.safetyLevel;
  const blockRecommend = context.blockRecommend;
  const hasSafetyRisk = context.hasSafetyRisk;

  if (doc.fileName === "00-safety-boundary.md") score += 1000;
  if (doc.fileName === "01-journaling-context-policy.md") score += 900;
  if (doc.fileName === "02-emotion-map.md") score += 800;
  if (doc.fileName === "03-intensity-response-rule.md") score += 800;
  if (doc.fileName === "04-intervention-library.md") score += 750;

  if (emotion && docText.includes(normalizeText(emotion))) score += 40;
  if (intensity && docText.includes(normalizeText(intensity))) score += 30;

  if (hasSafetyRisk || blockRecommend) {
    if (doc.fileName === "00-safety-boundary.md") score += 500;
    if (doc.fileName === "03-intensity-response-rule.md") score += 150;
    if (doc.fileName === "04-intervention-library.md") score += 120;
    if (docText.includes("safety")) score += 100;
    if (docText.includes("krisis")) score += 100;
  }

  if (
    safetyLevel &&
    ["red", "crisis", "darurat", "merah"].includes(
      normalizeText(safetyLevel)
    )
  ) {
    if (doc.fileName === "00-safety-boundary.md") score += 700;
    if (doc.fileName === "04-intervention-library.md") score += 200;
  }

  return score;
}

function truncateContent(content, maxChars = 8000) {
  if (!content) return "";

  if (content.length <= maxChars) return content;

  return `${content.slice(0, maxChars)}\n\n[Konten dipotong agar prompt tidak terlalu panjang.]`;
}

export function retrieveRelevantKnowledge({
  userMessage = "",
  journalContext = null,
  limit = 5,
  maxCharsPerDocument = 8000,
} = {}) {
  const documents = loadKnowledgeDocuments();

  const safetyFromText = detectSafetyFromText(userMessage);

  const emotion =
    getJournalContextValue(journalContext, "emotion") ||
    inferEmotionFromMessage(userMessage);

  const intensity =
    getJournalContextValue(journalContext, "intensity_label") ||
    inferIntensityFromMessage(userMessage);

  const safetyLevel =
  getSafetyLevelFromJournalContext(
    journalContext
  ) ||

  (
    safetyFromText.hasSafetyRisk
      ? "red"
      : "green"
  );
  const blockRecommend = getBlockRecommendFromJournalContext(journalContext);

  const retrievalQuery = buildRetrievalQuery({
    userMessage,
    journalContext,
  });

  const context = {
    emotion,
    intensity,
    safetyLevel,
    blockRecommend,
    hasSafetyRisk: safetyFromText.hasSafetyRisk,
  };

  const coreDocuments = getCoreDocuments(documents);

  const scoredDocuments = documents
    .map((doc) => ({
      ...doc,
      score: scoreDocument(doc, retrievalQuery, context),
    }))
    .sort((a, b) => b.score - a.score);

  const effectiveLimit = Math.min(
    documents.length,
    Math.max(limit, REQUIRED_CORE_FILES.length + 1)
  );

  const selectedMap = new Map();

  for (const doc of coreDocuments) {
    selectedMap.set(doc.relativePath, doc);
  }

  for (const doc of scoredDocuments) {
    if (selectedMap.size >= effectiveLimit) break;
    if (selectedMap.has(doc.relativePath)) continue;
    selectedMap.set(doc.relativePath, doc);
  }

  const selectedDocuments = Array.from(selectedMap.values()).map((doc) => ({
    id: doc.id,
    title: doc.title,
    fileName: doc.fileName,
    relativePath: doc.relativePath,
    type: doc.type,
    priority: doc.priority,
    metadata: doc.metadata,
    content: truncateContent(doc.content, maxCharsPerDocument),
  }));

  return {
    query: retrievalQuery,
    context: {
      emotion,
      intensity,
      safetyLevel,
      blockRecommend,
      hasSafetyRisk: safetyFromText.hasSafetyRisk,
      matchedSafetyKeywords: safetyFromText.matchedKeywords,
    },
    documents: selectedDocuments,
  };
}

export function formatKnowledgeForPrompt(retrievalResult) {
  const documents = retrievalResult?.documents || [];

  if (documents.length === 0) {
    return "Tidak ada dokumen knowledge yang tersedia.";
  }

  return documents
    .map((doc, index) => {
      return `
[KNOWLEDGE ${index + 1}]
File: ${doc.relativePath}
Title: ${doc.title}
Type: ${doc.type}
Priority: ${doc.priority}

${doc.content}
`;
    })
    .join("\n---\n");
}