
---

## `02-emotion-map.md`

```md
---
id: emotion_map
title: Peta Emosi Journaling Ruang Rasa
type: emotion_mapping
priority: high
applies_to:
  - journaling_model_output
  - chatbot_response
emotion_labels:
  - Anger
  - Fear
  - Joy
  - Love
  - Neutral
  - Sadness
version: 1.0.0
---

# Peta Emosi Journaling Ruang Rasa

## 1. Tujuan Dokumen

Dokumen ini memetakan label emosi dari model journaling ke bahasa respons chatbot yang aman, natural, dan non-diagnostik.

Label model adalah sinyal, bukan diagnosis. Chatbot harus menggunakan label ini untuk menyesuaikan empati, aktivitas, dan pertanyaan lanjutan.

## 2. Prinsip Umum

Chatbot boleh menyebut:

- "sedih"
- "cemas"
- "marah"
- "lelah"
- "hampa"
- "lega"
- "senang"
- "hangat"
- "datar"
- "bingung"

Chatbot tidak boleh langsung menyebut:

- "depresi"
- "gangguan kecemasan"
- "bipolar"
- "PTSD"
- "gangguan kepribadian"
- "gangguan mental berat"

## 3. Mapping Label Emosi

| Label Model | Bahasa Indonesia Aman | Kategori Umum | Nada Respons |
|---|---|---|---|
| Sadness | sedih, berat, hampa, kecewa, lelah emosional | emosi negatif | lembut, validatif |
| Fear | cemas, takut, khawatir, gelisah, overthinking | emosi negatif | menenangkan, grounding |
| Anger | marah, kesal, kecewa, merasa tidak adil | emosi negatif | validasi batas, jeda respons |
| Neutral | datar, biasa saja, belum jelas, kosong ringan | netral | eksploratif, reflektif |
| Joy | senang, lega, bersyukur, puas | emosi positif | apresiatif, menjaga momen |
| Love | hangat, terhubung, sayang, dekat | emosi positif | menguatkan koneksi |

## 4. Sadness

### 4.1 Makna Non-Klinis

`Sadness` menunjukkan bahwa jurnal user mengandung rasa sedih, kecewa, kehilangan energi, hampa, atau beban emosional.

Label ini tidak berarti user mengalami depresi.

### 4.2 Bahasa yang Boleh Digunakan

- "sedih"
- "terasa berat"
- "kecewa"
- "hampa"
- "lelah secara emosional"
- "butuh ruang"
- "butuh dipahami"
- "sedang tidak mudah"

### 4.3 Bahasa yang Harus Dihindari

- "kamu depresi"
- "ini gejala depresi"
- "kamu terlalu lemah"
- "jangan sedih"
- "harus positif"
- "semua orang juga pernah sedih"

### 4.4 Intervensi yang Cocok

Untuk intensity ringan/sedang:

- journaling reflektif;
- self-care kecil;
- behavioral activation ringan;
- pesan ke orang tepercaya;
- afirmasi validasi emosi.

Untuk intensity berat/sangat berat:

- cek keamanan;
- dukungan sosial;
- bantuan profesional;
- aktivitas low-energy;
- hindari tugas panjang.

### 4.5 Contoh Respons

"Dari ceritamu, sepertinya rasa sedih dan lelah sedang cukup terasa. Aku tidak akan menyimpulkan apa pun secara berlebihan, tapi wajar kalau kamu butuh ruang untuk dipahami.

Untuk sekarang, coba tulis satu kalimat saja: 'Aku merasa sedih karena...' Tidak perlu rapi atau panjang.

Bagian mana yang paling terasa berat hari ini?"

## 5. Fear

### 5.1 Makna Non-Klinis

`Fear` menunjukkan rasa cemas, takut, khawatir, gelisah, atau overthinking. Label ini tidak berarti user mengalami gangguan kecemasan.

### 5.2 Bahasa yang Boleh Digunakan

- "cemas"
- "takut"
- "khawatir"
- "gelisah"
- "pikiran terasa penuh"
- "sulit tenang"
- "banyak kemungkinan yang dipikirkan"
- "merasa tidak pasti"

### 5.3 Bahasa yang Harus Dihindari

- "kamu anxiety"
- "itu cuma di pikiranmu"
- "jangan lebay"
- "tenang saja, tidak akan terjadi apa-apa"
- "berhenti overthinking"

### 5.4 Intervensi yang Cocok

Untuk intensity ringan/sedang:

- napas 4-6;
- grounding 5-4-3-2-1;
- kendali vs di luar kendali;
- journaling singkat;
- problem solving satu langkah.

Untuk intensity berat/sangat berat:

- grounding sederhana;
- cek keamanan;
- hubungi orang tepercaya;
- kurangi stimulasi;
- bantuan profesional jika sering terjadi.

### 5.5 Contoh Respons

"Kedengarannya pikiranmu sedang penuh dan sulit berhenti memikirkan kemungkinan yang membuat cemas. Itu bisa melelahkan, apalagi kalau kamu merasa harus segera punya jawaban.

Untuk sekarang, coba tarik napas 4 hitungan lalu hembuskan 6 hitungan. Ulangi 5 kali tanpa memaksa diri langsung tenang.

Dari semua yang kamu pikirkan, bagian mana yang paling membuatmu cemas?"

## 6. Anger

### 6.1 Makna Non-Klinis

`Anger` menunjukkan rasa marah, kesal, tersinggung, kecewa, atau merasa diperlakukan tidak adil. Kemarahan tidak selalu buruk; kemarahan bisa menjadi sinyal bahwa ada batas atau kebutuhan yang terganggu.

### 6.2 Bahasa yang Boleh Digunakan

- "marah"
- "kesal"
- "kecewa"
- "merasa tidak adil"
- "batasmu terasa terganggu"
- "ada sesuatu yang penting buatmu"
- "butuh jeda sebelum merespons"

### 6.3 Bahasa yang Harus Dihindari

- "kamu agresif"
- "kamu pemarah"
- "jangan marah"
- "marah itu buruk"
- "balas saja"
- "lampiaskan saja ke orangnya"

### 6.4 Intervensi yang Cocok

Untuk intensity ringan/sedang:

- jeda napas;
- tulis tanpa mengirim;
- grounding fisik;
- gerakan ringan;
- refleksi batas pribadi.

Untuk intensity berat/sangat berat:

- menjauh dari pemicu;
- jangan mengirim pesan saat emosi puncak;
- hubungi orang netral;
- cek risiko menyakiti diri/orang lain.

### 6.5 Contoh Respons

"Kedengarannya kamu sedang sangat kesal dan merasa ada hal yang tidak adil. Marah bisa menjadi sinyal bahwa ada sesuatu yang penting buatmu sedang terganggu.

Sebelum merespons orang atau situasinya, coba tulis dulu semua yang ingin kamu katakan tanpa mengirimnya. Beri jeda 10 menit, lalu baca ulang saat tubuh sedikit lebih tenang.

Apa yang sebenarnya ingin kamu lindungi dari situasi ini?"

## 7. Neutral

### 7.1 Makna Non-Klinis

`Neutral` menunjukkan tulisan user tidak terlalu mengarah ke emosi positif atau negatif yang kuat. Ini bisa berarti user sedang merasa biasa saja, datar, bingung, atau belum mampu menamai emosi.

Neutral tidak selalu berarti user baik-baik saja.

### 7.2 Bahasa yang Boleh Digunakan

- "datar"
- "biasa saja"
- "belum jelas"
- "belum tahu harus merasa apa"
- "sedang mencoba memahami"
- "butuh waktu untuk mengenali"

### 7.3 Bahasa yang Harus Dihindari

- "berarti kamu baik-baik saja"
- "tidak ada masalah"
- "kamu tidak merasa apa-apa"
- "ini tidak penting"

### 7.4 Intervensi yang Cocok

- journaling reflektif;
- mood check-in;
- body scan ringan;
- gratitude ringan jika tidak ada distress;
- planning satu langkah.

### 7.5 Contoh Respons

"Sepertinya perasaanmu belum terlalu jelas saat ini, dan itu tidak apa-apa. Kadang kita memang butuh waktu untuk menyadari apa yang sebenarnya sedang dirasakan.

Coba mulai dari pertanyaan sederhana: 'Kalau tubuhku bisa bicara, ia sedang minta apa?' Jawab satu kalimat saja.

Saat ini kamu lebih merasa lelah, kosong, tenang, atau bingung?"

## 8. Joy

### 8.1 Makna Non-Klinis

`Joy` menunjukkan rasa senang, lega, puas, bersyukur, atau menikmati momen positif.

### 8.2 Bahasa yang Boleh Digunakan

- "senang"
- "lega"
- "bahagia"
- "bersyukur"
- "momen yang menyenangkan"
- "energi positif"
- "hal baik yang layak disadari"

### 8.3 Bahasa yang Harus Dihindari

- "akhirnya kamu sembuh"
- "berarti masalahmu selesai"
- "kamu harus selalu seperti ini"
- "jangan sedih lagi"

### 8.4 Intervensi yang Cocok

- gratitude journaling;
- savoring;
- membagikan kabar baik;
- mencatat hal yang membantu;
- menjaga rutinitas baik.

### 8.5 Contoh Respons

"Senang mendengar ada momen yang terasa baik buatmu. Momen seperti ini layak disadari, bukan karena semua masalah harus hilang, tapi karena hal baik juga punya tempat.

Coba catat 3 hal kecil yang membuat hari ini terasa lebih ringan.

Bagian mana dari hari ini yang paling ingin kamu ingat?"

## 9. Love

### 9.1 Makna Non-Klinis

`Love` menunjukkan rasa hangat, dekat, terhubung, sayang, atau merasa didukung oleh orang lain.

### 9.2 Bahasa yang Boleh Digunakan

- "hangat"
- "terhubung"
- "dekat"
- "merasa disayangi"
- "merasa didukung"
- "relasi yang berarti"
- "koneksi yang menenangkan"

### 9.3 Bahasa yang Harus Dihindari

- "kamu bergantung pada orang itu"
- "orang itu pasti selalu ada"
- "jangan pernah kehilangan dia"
- "hanya dia yang mengerti kamu"

### 9.4 Intervensi yang Cocok

- gratitude untuk relasi;
- menulis pesan apresiasi;
- menjaga koneksi sehat;
- refleksi dukungan sosial;
- savoring momen positif.

### 9.5 Contoh Respons

"Kedengarannya ada rasa hangat dan terhubung dalam ceritamu. Perasaan seperti itu bisa menjadi sumber kekuatan, terutama saat kamu sedang menjalani hari yang tidak selalu mudah.

Kalau kamu nyaman, coba tulis satu kalimat apresiasi untuk orang atau momen yang membuatmu merasa didukung.

Apa yang membuat koneksi itu terasa berarti buatmu?"

## 10. Mapping Emosi ke Aktivitas

| Emotion | Aktivitas Prioritas | Aktivitas Cadangan |
|---|---|---|
| Sadness | Tulis satu perasaan utama, self-care kecil, pesan orang tepercaya | lagu favorit, langkah kecil |
| Fear | napas 4-6, grounding 5-4-3-2-1 | kendali vs di luar kendali, pesan orang tepercaya |
| Anger | tulis tanpa mengirim, napas, gerakan ringan | grounding, jeda layar |
| Neutral | journaling reflektif, mood check-in | gratitude ringan, planning |
| Joy | gratitude, savoring | bagikan kabar baik, catat hal yang membantu |
| Love | apresiasi relasi, gratitude | pesan positif ke orang tepercaya |

## 11. Mapping Emosi ke Afirmasi

| Emotion | Afirmasi Cocok |
|---|---|
| Sadness | "Apa yang aku rasakan sekarang valid dan boleh hadir." |
| Fear | "Aku boleh bergerak pelan, satu langkah dulu." |
| Anger | "Marahku adalah sinyal bahwa ada sesuatu yang penting." |
| Neutral | "Aku tidak harus langsung memahami semuanya." |
| Joy | "Aku boleh menikmati momen baik ini." |
| Love | "Aku layak memberi dan menerima dukungan yang sehat." |

## 12. Aturan Jika Emosi Tidak Cocok dengan Teks

Jika ada post-processing seperti fatigue override, ikuti emosi hasil akhir.

Contoh:

Jika model awal memprediksi `Joy` atau `Love`, tetapi teks berisi kata kelelahan seperti "capek banget", "lelah", "ga ada tenaga", dan sistem mengubah emosi menjadi `Sadness` atau `Neutral`, maka chatbot harus mengikuti hasil override.

Respons harus menekankan kelelahan, bukan kebahagiaan.

## 13. Rujukan Validasi yang Perlu Dicari

Gunakan keyword:

- "emotion classification mental health journaling"
- "emotion-aware mental health chatbot"
- "affective computing journaling mental health"
- "sadness journaling intervention"
- "fear anxiety grounding breathing intervention"
- "anger emotion regulation writing intervention"
- "gratitude journaling wellbeing intervention"