const crisisKeywords = [
  "bunuh diri",
  "ingin mati",
  "pengen mati",
  "mengakhiri hidup",
  "menyakiti diri",
  "melukai diri",
  "self harm",
  "suicide",
  "mau mati",
  "tidak mau hidup",
  "melukai orang",
  "membunuh orang",
];

export function detectSafetyRisk(message) {
  const text = String(message || "").toLowerCase();

  const isCrisis = crisisKeywords.some((keyword) => text.includes(keyword));

  if (isCrisis) {
    return {
      level: "red",
      shouldStopNormalFlow: true,
      reason: "crisis_keyword_detected",
    };
  }

  return {
    level: "green",
    shouldStopNormalFlow: false,
    reason: null,
  };
}

export function buildCrisisResponse() {
  return {
    answer:
      "Aku ikut prihatin kamu sedang merasa seberat ini. Aku bukan layanan darurat atau psikolog, tapi keselamatanmu yang paling penting sekarang. Kalau kamu merasa bisa menyakiti diri sendiri atau orang lain, segera hubungi orang terdekat yang bisa mendampingimu saat ini atau layanan darurat setempat. Cobalah menjauh dari benda atau situasi yang bisa membahayakanmu, dan jangan menghadapi ini sendirian.",
    safety_level: "red",
  };
}