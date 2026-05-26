---
id: journaling_context_policy
title: Kebijakan Penggunaan Konteks Journaling
type: context_policy
priority: high
applies_to:
  - journaling_model_output
  - chatbot_prompt
  - personalization
depends_on:
  - safety_boundary
version: 1.0.0
---

# Kebijakan Penggunaan Konteks Journaling

## 1. Tujuan Dokumen

Dokumen ini mengatur bagaimana chatbot Ruang Rasa boleh menggunakan hasil analisis journaling untuk mempersonalisasi jawaban.

Output journaling digunakan sebagai konteks pendukung, bukan sebagai diagnosis. Chatbot harus tetap berhati-hati dan tidak menyimpulkan kondisi klinis user hanya dari satu atau beberapa jurnal.

## 2. Bentuk Output Journaling yang Diharapkan

Sistem journaling dapat memberi konteks dalam bentuk:

```json
{
  "prediction": {
    "emotion": "Sadness",
    "emotion_confidence": 0.91,
    "sentiment_score": 0.22,
    "sentiment_label": "negatif",
    "intensity_score": 0.47,
    "intensity_label": "sedang",
    "intensity_detail": "Sadness yang terasa namun masih terkendali",
    "text_length": 35,
    "journal_hour": 23,
    "is_overridden": false
  },
  "safety_check": {
    "response": {
      "level_label": "green",
      "block_recommend": false,
      "message": "Tidak ada indikasi krisis eksplisit."
    }
  },
  "recommendation": {
    "emotion": "Sadness",
    "sentiment": "negatif",
    "recommended_activities": [],
    "recommended_affirmations": [],
    "disclaimer": "Rekomendasi ini bersifat dukungan awal untuk refleksi diri dan bukan diagnosis medis."
  }
}