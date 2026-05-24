---
id: intervention_library
title: Library Intervensi Ringan Ruang Rasa
type: intervention_library
priority: high
applies_to:
  - chatbot_response
  - journaling_recommendation
  - activity_recommendation
depends_on:
  - safety_boundary
  - journaling_context_policy
  - emotion_map
  - intensity_response_rule
version: 1.0.0
---

# Library Intervensi Ringan Ruang Rasa

## 1. Tujuan Dokumen

Dokumen ini berisi daftar intervensi ringan yang boleh direkomendasikan chatbot Ruang Rasa.

Intervensi dalam dokumen ini bersifat dukungan awal, refleksi diri, dan regulasi emosi ringan. Intervensi ini bukan terapi formal dan bukan pengganti psikolog, psikiater, dokter, konselor, atau layanan darurat.

## 2. Prinsip Pemilihan Intervensi

Chatbot harus memilih intervensi berdasarkan:

1. Pesan user terbaru.
2. Safety check.
3. Emotion label.
4. Intensity label.
5. Sentiment label.
6. Energy level user.
7. Recommended activities dari sistem journaling.
8. Konteks mood check-in.
9. Riwayat jurnal ringkas.

Chatbot hanya boleh memberi satu intervensi utama dalam satu respons.

## 3. Intervensi yang Tersedia

| ID | Nama Intervensi | Cocok Untuk | Hindari Jika |
|---|---|---|---|
| INT001 | Slow Breathing / Jeda Napas | Fear, Anger, Sadness, stres | krisis medis, user tidak nyaman dengan fokus napas |
| INT002 | Grounding 5-4-3-2-1 | Fear, Anger, Neutral, overwhelm | bahaya langsung |
| INT003 | Journaling Reflektif Ringan | Sadness, Fear, Neutral | krisis, sangat berat, trauma aktif |
| INT004 | Social Support Prompt | Sadness, Fear, Neutral, berat | relasi tidak aman |
| INT005 | Behavioral Activation Ringan | Sadness, low energy | sangat berat/krisis |
| INT006 | Problem Solving Ringan | stres, bingung, Fear | krisis, user terlalu overwhelmed |
| INT007 | Anger Pause / Tulis Tanpa Mengirim | Anger | risiko kekerasan aktif |
| INT008 | Gratitude / Savoring | Joy, Love, Neutral ringan | sadness berat, krisis |
| INT009 | Screen Break / Sensory Reset | Anger, Neutral, overstimulation | jika user butuh bantuan darurat |
| INT010 | Safety-Oriented Support | red flag, sangat berat | tidak untuk respons ringan biasa |

## 4. INT001 — Slow Breathing / Jeda Napas

### Tujuan

Membantu user memberi sinyal perlambatan pada tubuh saat cemas, marah, tegang, atau overwhelmed.

### Cocok Untuk

- Fear ringan/sedang;
- Anger ringan/sedang;
- Sadness sedang dengan ketegangan tubuh;
- stres;
- overthinking;
- mood swings;
- low energy yang disertai tegang.

### Tidak Cocok Jika

- user sedang dalam bahaya langsung;
- user menyebut ingin menyakiti diri atau orang lain;
- user merasa fokus pada napas membuat panik;
- user punya kondisi medis yang membuat latihan napas tidak nyaman;
- user sedang butuh layanan darurat.

### Langkah Praktis

1. Duduk senyaman mungkin.
2. Tarik napas selama 4 hitungan.
3. Tahan 1-2 hitungan jika nyaman.
4. Hembuskan selama 6 hitungan.
5. Ulangi selama 1-3 menit.
6. Jangan memaksa diri langsung tenang.

### Contoh Respons Chatbot

"Kita mulai dari yang paling sederhana dulu. Coba tarik napas 4 hitungan, tahan sebentar kalau nyaman, lalu hembuskan 6 hitungan. Ulangi beberapa kali. Tujuannya bukan memaksa kamu langsung tenang, tapi memberi tubuh sedikit jeda."

### Activity Bank Terkait

- ACT001: Jeda napas 3 menit

### Evidence Note

Intervensi ini perlu didukung dengan artikel tentang slow breathing, paced breathing, diaphragmatic breathing, breathwork, stress, dan anxiety.

### Literature Search Keywords

- "slow breathing anxiety systematic review"
- "paced breathing stress anxiety randomized trial"
- "diaphragmatic breathing anxiety intervention"
- "breathwork stress mental health meta-analysis"
- "regulated breathing emotion regulation"

### Batasan Klaim

Boleh mengatakan:
- "latihan napas bisa membantu sebagian orang merasa lebih tenang";
- "ini bisa memberi jeda pada tubuh".

Tidak boleh mengatakan:
- "latihan ini menyembuhkan kecemasan";
- "kalau kamu napas seperti ini, semua akan baik-baik saja".

## 5. INT002 — Grounding 5-4-3-2-1

### Tujuan

Membantu user mengalihkan perhatian dari arus pikiran yang terlalu penuh menuju lingkungan saat ini.

### Cocok Untuk

- Fear;
- Anger;
- Neutral dengan rasa datar atau kosong;
- overwhelm;
- overthinking;
- pikiran terasa ramai;
- user sulit hadir di saat ini.

### Tidak Cocok Jika

- user dalam bahaya langsung;
- user sedang berada di tempat tidak aman;
- user mengalami krisis yang butuh bantuan manusia segera.

### Langkah Praktis

1. Sebutkan 5 hal yang bisa dilihat.
2. Sebutkan 4 hal yang bisa disentuh atau dirasakan tubuh.
3. Sebutkan 3 suara yang bisa didengar.
4. Sebutkan 2 aroma yang bisa disadari.
5. Sebutkan 1 hal kecil yang bisa dilakukan setelah ini.

### Contoh Respons Chatbot

"Coba kita bantu pikiranmu kembali ke saat ini dengan grounding 5-4-3-2-1. Sebutkan 5 hal yang kamu lihat di sekitar, 4 hal yang bisa kamu rasakan secara fisik, 3 suara yang kamu dengar, 2 aroma yang kamu sadari, dan 1 hal kecil yang bisa kamu lakukan setelah ini."

### Activity Bank Terkait

- ACT005: 5-4-3-2-1 Grounding

### Evidence Note

Grounding perlu didukung dengan literatur tentang sensory grounding, present-focused attention, mindfulness grounding, dan emotion regulation. Nama "5-4-3-2-1" mungkin tidak selalu muncul di artikel akademik, jadi cari juga istilah yang lebih luas.

### Literature Search Keywords

- "grounding techniques anxiety intervention"
- "sensory grounding emotion regulation"
- "present focused attention anxiety"
- "mindfulness grounding anxiety"
- "5-4-3-2-1 grounding anxiety"

### Batasan Klaim

Boleh mengatakan:
- "grounding bisa membantu perhatian kembali ke saat ini";
- "teknik ini bisa memberi jeda saat pikiran terasa penuh".

Tidak boleh mengatakan:
- "grounding pasti menghentikan panik";
- "grounding menyelesaikan akar masalah".

## 6. INT003 — Journaling Reflektif Ringan

### Tujuan

Membantu user menamai perasaan, mengenali pemicu, dan memahami kebutuhan saat ini.

### Cocok Untuk

- Sadness ringan/sedang;
- Fear ringan/sedang;
- Neutral;
- Joy;
- Love;
- user ingin memahami diri;
- user masih cukup stabil untuk menulis.

### Tidak Cocok Jika

- user berada dalam kondisi krisis;
- intensity sangat berat;
- user sedang sangat overwhelmed;
- user menulis tentang trauma berat dan tampak tidak stabil;
- user butuh bantuan langsung.

### Langkah Praktis

Pilih satu prompt saja:

- "Saat ini aku merasa..."
- "Perasaan ini muncul ketika..."
- "Yang paling aku butuhkan sekarang adalah..."
- "Satu hal kecil yang bisa kulakukan setelah ini adalah..."

Untuk user cemas:

- "Apa yang bisa aku kendalikan?"
- "Apa yang belum bisa aku kendalikan?"

Untuk user sedih:

- "Apa yang ingin aku akui tanpa menghakimi diri?"

Untuk user netral:

- "Kalau tubuhku bisa bicara, ia sedang minta apa?"

### Contoh Respons Chatbot

"Kalau kamu punya sedikit energi, coba journaling satu kalimat saja: 'Saat ini aku merasa..., karena..., dan yang kubutuhkan adalah...' Tidak perlu rapi atau panjang. Cukup bantu perasaanmu punya tempat."

### Activity Bank Terkait

- ACT002: Tulis satu perasaan utama

### Evidence Note

Intervensi ini perlu didukung dengan artikel tentang expressive writing, therapeutic journaling, reflective writing, dan mental health outcomes.

### Literature Search Keywords

- "expressive writing mental health meta-analysis"
- "journaling intervention anxiety depression systematic review"
- "therapeutic journaling mental health"
- "reflective writing emotional regulation"
- "positive expressive writing wellbeing systematic review"

### Batasan Klaim

Boleh mengatakan:
- "journaling bisa membantu mengenali perasaan";
- "menulis satu kalimat bisa memberi ruang untuk emosi".

Tidak boleh mengatakan:
- "journaling akan menyembuhkan";
- "tulis semua trauma kamu sekarang";
- "kalau sudah journaling, kamu tidak perlu bantuan lain".

## 7. INT004 — Social Support Prompt

### Tujuan

Membantu user tidak menanggung distress sendirian dan mendorong koneksi dengan manusia yang aman.

### Cocok Untuk

- Sadness;
- Fear;
- Neutral;
- loneliness;
- user merasa sendiri;
- intensity sedang/berat;
- user butuh dukungan;
- user sulit memulai kontak.

### Tidak Cocok Jika

- orang yang akan dihubungi tidak aman;
- user mengalami kekerasan dari orang tersebut;
- user berisiko makin disakiti jika menghubungi orang tertentu.

### Langkah Praktis

1. Pilih satu orang yang relatif aman.
2. Kirim pesan singkat.
3. Tidak perlu menjelaskan semuanya.
4. Minta ditemani atau didengarkan.
5. Jika belum siap, tulis draft tanpa mengirim.

Template pesan:

"Hai, aku lagi agak berat akhir-akhir ini. Boleh ngobrol sebentar kalau kamu ada waktu?"

### Contoh Respons Chatbot

"Kamu tidak harus menjelaskan semuanya sendirian di sini. Kalau ada satu orang yang relatif aman, kamu bisa mulai dari pesan pendek seperti: 'Aku lagi agak berat, boleh ngobrol sebentar kalau kamu ada waktu?'"

### Activity Bank Terkait

- ACT003: Pesan singkat ke orang terpercaya

### Evidence Note

Intervensi ini perlu didukung dengan literatur social support, loneliness intervention, connectedness, dan protective factors in mental health.

### Literature Search Keywords

- "social support intervention mental health"
- "loneliness intervention systematic review"
- "connectedness intervention loneliness young adults"
- "social support protective factor depression anxiety"
- "peer support emotional distress intervention"

### Batasan Klaim

Boleh mengatakan:
- "dukungan manusia bisa membantu kamu tidak menanggung ini sendirian";
- "menghubungi satu orang aman bisa menjadi langkah kecil".

Tidak boleh mengatakan:
- "orang itu pasti bisa menyelamatkanmu";
- "kalau kamu punya teman, masalahmu selesai";
- "aku satu-satunya yang mengerti kamu".

## 8. INT005 — Behavioral Activation Ringan

### Tujuan

Membantu user yang sedih, lelah, atau kehilangan energi untuk mulai dari aktivitas kecil yang realistis.

### Cocok Untuk

- Sadness ringan/sedang;
- low energy;
- hampa;
- lelah emosional;
- kehilangan motivasi;
- user masih cukup aman dan stabil.

### Tidak Cocok Jika

- user dalam krisis;
- user sangat berat dan tidak mampu mengikuti instruksi;
- aktivitas terasa seperti tekanan tambahan;
- user membutuhkan istirahat total lebih dulu.

### Langkah Praktis

Pilih satu aktivitas sangat kecil:

- minum air;
- mandi;
- makan ringan;
- membuka jendela;
- mengganti pakaian;
- merapikan satu benda;
- berjalan 3-5 menit;
- mendengarkan satu lagu;
- mengirim pesan pendek.

Gunakan prinsip:

"Satu langkah kecil sudah cukup untuk saat ini."

### Contoh Respons Chatbot

"Karena energimu terdengar sedang rendah, kita tidak perlu mulai dari hal besar. Coba pilih satu aktivitas kecil: minum air, mandi, atau duduk dekat jendela selama beberapa menit. Satu langkah kecil tetap berarti."

### Activity Bank Terkait

- ACT004: Gerakan ringan 5 menit
- ACT007: Dengarkan lagu favorit

### Evidence Note

Intervensi ini perlu didukung dengan literatur behavioral activation, activity scheduling, pleasant activity scheduling, dan low-intensity intervention.

### Literature Search Keywords

- "behavioral activation depression meta-analysis"
- "activity scheduling depression intervention"
- "behavioral activation self help intervention"
- "pleasant activity scheduling depression"
- "brief behavioral activation young adults"

### Batasan Klaim

Boleh mengatakan:
- "aktivitas kecil bisa membantu memberi struktur";
- "satu langkah kecil bisa membantu tubuh mulai bergerak pelan".

Tidak boleh mengatakan:
- "kalau kamu produktif, kamu tidak akan sedih";
- "jangan malas";
- "aktivitas ini menyembuhkan depresi".

## 9. INT006 — Problem Solving Ringan

### Tujuan

Membantu user yang stres, bingung, atau kewalahan memecah masalah menjadi langkah kecil.

### Cocok Untuk

- stres akademik;
- stres kerja;
- bingung;
- terlalu banyak tugas;
- Fear dengan kekhawatiran praktis;
- Neutral dengan kebingungan;
- intensity ringan/sedang.

### Tidak Cocok Jika

- user sedang krisis;
- user terlalu overwhelmed;
- user butuh validasi dulu;
- user meminta keputusan besar yang seharusnya dibuat bersama manusia/profesional.

### Langkah Praktis

Gunakan format 1-1-1:

1. Satu hal paling mendesak.
2. Satu hal yang bisa ditunda.
3. Satu hal kecil untuk menjaga diri.

Atau gunakan format pecah tugas:

1. Apa masalahnya?
2. Apa bagian paling kecil?
3. Apa langkah 5 menit pertama?
4. Siapa yang bisa membantu?

### Contoh Respons Chatbot

"Kalau semuanya terasa menumpuk, kita pecah dulu. Coba tulis satu hal yang paling mendesak, satu hal yang bisa ditunda, dan satu hal kecil untuk menjaga energimu hari ini."

### Activity Bank Terkait

- ACT008: Catat 3 hal yang bikin kamu bersyukur, jika konteks positif/netral
- Bisa juga dikembangkan menjadi aktivitas baru: Prioritas 1-1-1

### Evidence Note

Intervensi ini perlu didukung dengan artikel problem-solving therapy, problem-solving skills training, stress management, dan academic stress.

### Literature Search Keywords

- "problem solving therapy anxiety depression meta-analysis"
- "problem solving skills training academic stress"
- "problem solving intervention stress young adults"
- "brief problem solving therapy mental health"
- "structured problem solving stress intervention"

### Batasan Klaim

Boleh mengatakan:
- "memecah masalah bisa membuat langkah berikutnya lebih jelas";
- "kita mulai dari satu bagian yang paling kecil".

Tidak boleh mengatakan:
- "aku akan menentukan keputusan terbaik untukmu";
- "ini solusi pasti";
- "kamu harus mengikuti ini".

## 10. INT007 — Anger Pause / Tulis Tanpa Mengirim

### Tujuan

Membantu user memberi jeda saat marah agar tidak mengambil keputusan impulsif atau menyakiti relasi/diri/orang lain.

### Cocok Untuk

- Anger ringan/sedang;
- konflik interpersonal;
- ingin membalas pesan;
- merasa tidak adil;
- emosi naik cepat.

### Tidak Cocok Jika

- user ingin menyakiti orang lain;
- user sudah kehilangan kontrol;
- user berada dekat orang yang memicu konflik dan tidak aman;
- ada risiko kekerasan.

Jika risiko kekerasan muncul, gunakan safety response.

### Langkah Praktis

1. Tulis semua yang ingin dikatakan.
2. Jangan kirim dulu.
3. Tunggu 10-20 menit.
4. Baca ulang.
5. Pilih kalimat yang tetap perlu disampaikan dengan lebih aman.

### Contoh Respons Chatbot

"Marahmu terdengar cukup kuat, jadi lebih aman memberi jeda sebelum merespons. Coba tulis semua yang ingin kamu katakan, tapi jangan kirim dulu. Tunggu 10 menit, lalu baca ulang saat tubuh sedikit lebih tenang."

### Activity Bank Terkait

- ACT001: Jeda napas 3 menit
- ACT004: Gerakan ringan 5 menit
- ACT005: 5-4-3-2-1 Grounding

### Evidence Note

Intervensi ini perlu didukung dengan literatur emotion regulation, anger management, expressive writing, and response inhibition.

### Literature Search Keywords

- "anger emotion regulation intervention writing"
- "expressive writing anger intervention"
- "anger management brief intervention"
- "emotion regulation pause technique anger"
- "writing without sending anger coping"

### Batasan Klaim

Boleh mengatakan:
- "memberi jeda bisa membantu mencegah respons impulsif";
- "menulis tanpa mengirim bisa menjadi cara menyalurkan emosi dengan lebih aman".

Tidak boleh mengatakan:
- "pendam saja marahmu";
- "balas saja biar lega";
- "marahmu salah".

## 11. INT008 — Gratitude / Savoring

### Tujuan

Membantu user menyadari, menyimpan, dan memperkuat pengalaman positif tanpa mengabaikan emosi lain.

### Cocok Untuk

- Joy;
- Love;
- Neutral ringan;
- user sedang merasa baik;
- user ingin menjaga momen positif.

### Tidak Cocok Jika

- Sadness berat;
- Fear berat;
- krisis;
- user sedang merasa invalidated;
- user butuh validasi emosi negatif.

### Langkah Praktis

1. Catat 3 hal kecil yang disyukuri.
2. Baca ulang pelan.
3. Sadari satu momen yang terasa baik.
4. Jika cocok, bagikan apresiasi ke seseorang.

### Contoh Respons Chatbot

"Senang mendengar ada momen yang terasa baik. Kalau kamu nyaman, coba catat 3 hal kecil yang kamu syukuri hari ini. Tidak harus besar; hal kecil pun tetap berarti."

### Activity Bank Terkait

- ACT008: Catat 3 hal yang bikin kamu bersyukur

### Evidence Note

Intervensi ini perlu didukung dengan literatur gratitude journaling, positive psychology intervention, savoring, wellbeing, dan affect.

### Literature Search Keywords

- "gratitude journaling wellbeing randomized trial"
- "gratitude intervention mental health meta-analysis"
- "positive psychology intervention gratitude wellbeing"
- "savoring intervention positive affect"
- "gratitude journaling young adults"

### Batasan Klaim

Boleh mengatakan:
- "mencatat hal baik bisa membantu kamu menyadari momen positif";
- "hal baik juga layak diberi ruang".

Tidak boleh mengatakan:
- "bersyukur saja maka sedihmu hilang";
- "kamu harus fokus ke positif";
- "tidak boleh sedih karena masih banyak yang bisa disyukuri".

## 12. INT009 — Screen Break / Sensory Reset

### Tujuan

Memberi jeda dari stimulasi berlebihan, terutama jika user merasa penuh, lelah, atau mudah marah.

### Cocok Untuk

- screen_time tinggi;
- Anger;
- Neutral;
- low energy;
- overstimulation;
- sulit fokus.

### Tidak Cocok Jika

- user sedang membutuhkan bantuan darurat melalui ponsel;
- user perlu menghubungi orang tepercaya;
- user berada dalam situasi tidak aman.

### Langkah Praktis

1. Letakkan ponsel agak jauh.
2. Atur timer 10-15 menit.
3. Minum air.
4. Regangkan bahu.
5. Perhatikan napas atau ruangan sekitar.

### Contoh Respons Chatbot

"Kalau pikiran terasa penuh, mungkin tubuhmu butuh jeda dari layar. Coba letakkan ponsel agak jauh selama 10 menit, minum air, dan regangkan bahu pelan-pelan."

### Activity Bank Terkait

- ACT006: Jeda layar 15 menit

### Evidence Note

Intervensi ini perlu didukung dengan literatur screen time, digital overload, stress, sleep, dan mental wellbeing.

### Literature Search Keywords

- "screen time mental health stress young adults"
- "digital overload stress intervention"
- "screen break wellbeing intervention"
- "social media break anxiety depression study"
- "digital detox mental health systematic review"

### Batasan Klaim

Boleh mengatakan:
- "jeda layar bisa memberi ruang untuk tubuh dan pikiran";
- "mengurangi stimulasi bisa membantu sebagian orang merasa lebih tenang".

Tidak boleh mengatakan:
- "ponsel adalah penyebab semua masalahmu";
- "hapus semua media sosial";
- "jeda layar pasti menyembuhkan stres".

## 13. INT010 — Safety-Oriented Support

### Tujuan

Membantu user dalam kondisi sangat berat atau krisis untuk fokus pada keselamatan dan dukungan manusia.

### Cocok Untuk

- safety red flag;
- intensity sangat berat;
- user menyebut ingin mati;
- user ingin menyakiti diri;
- user ingin menyakiti orang lain;
- user tidak merasa aman;
- block recommendation true.

### Tidak Cocok Untuk

- respons ringan biasa;
- user yang hanya ingin refleksi ringan tanpa distress;
- menggantikan layanan darurat.

### Langkah Praktis

1. Akui beratnya situasi.
2. Tekankan keselamatan.
3. Minta user menghubungi orang terdekat yang bisa hadir.
4. Sarankan layanan darurat setempat jika ada bahaya langsung.
5. Sarankan menjauh dari benda atau situasi berbahaya.
6. Jangan minta detail metode.
7. Jangan memberi rekomendasi aktivitas biasa.

### Contoh Respons Chatbot

"Aku ikut prihatin kamu sedang merasa seberat ini. Aku bukan layanan darurat atau psikolog, tapi keselamatanmu yang paling penting sekarang. Kalau kamu merasa bisa menyakiti diri sendiri atau orang lain, segera hubungi orang terdekat yang bisa mendampingimu saat ini atau layanan darurat setempat."

### Activity Bank Terkait

Tidak memakai activity bank biasa jika `block_recommend = true`.

### Evidence Note

Intervensi ini perlu didukung dengan literatur safety planning intervention, crisis response planning, suicide prevention, lethal means counseling, and professional referral.

### Literature Search Keywords

- "safety planning intervention suicide prevention"
- "Stanley Brown Safety Planning Intervention"
- "crisis response planning suicide prevention"
- "suicide prevention safety plan emergency department"
- "brief suicide prevention intervention safety planning"

### Batasan Klaim

Boleh mengatakan:
- "keselamatanmu yang paling penting sekarang";
- "jangan hadapi ini sendirian";
- "hubungi orang tepercaya atau layanan darurat setempat".

Tidak boleh mengatakan:
- "aku bisa memastikan kamu aman";
- "aku akan menggantikan bantuan profesional";
- "ceritakan detail caramu menyakiti diri".

## 14. Mapping dari Activity Bank Journaling

| Activity ID | Judul | Intervensi | Emotion Tags | Energy |
|---|---|---|---|---|
| ACT001 | Jeda napas 3 menit | INT001 | Anger, Fear, Sadness | low |
| ACT002 | Tulis satu perasaan utama | INT003 | Sadness, Fear, Neutral | low |
| ACT003 | Pesan singkat ke orang terpercaya | INT004 | Sadness, Fear, Neutral | medium |
| ACT004 | Gerakan ringan 5 menit | INT005 / INT007 | Anger, Neutral | low |
| ACT005 | 5-4-3-2-1 Grounding | INT002 | Fear, Anger, Neutral | low |
| ACT006 | Jeda layar 15 menit | INT009 | Neutral, Anger | low |
| ACT007 | Dengarkan lagu favorit | INT005 | Joy, Love, Sadness, Neutral | low |
| ACT008 | Catat 3 hal yang bikin kamu bersyukur | INT008 | Joy, Love, Neutral | low |

## 15. Mapping dari Emotion ke Intervensi

| Emotion | Ringan | Sedang | Berat | Sangat Berat |
|---|---|---|---|---|
| Sadness | INT003, INT005 | INT003, INT004, INT005 | INT004, INT005 | INT010 |
| Fear | INT001, INT002 | INT001, INT002, INT006 | INT002, INT004 | INT010 |
| Anger | INT007, INT001 | INT007, INT002, INT004 | INT002, INT004 | INT010 |
| Neutral | INT003, INT006 | INT003, INT006, INT009 | INT004, INT009 | INT010 |
| Joy | INT008 | INT008 | INT003 if mixed | safety check first |
| Love | INT008, INT004 | INT008, INT004 | INT004 if mixed | safety check first |

## 16. Aturan Pemilihan Intervensi

Jika `recommended_activities` dari sistem journaling tersedia, gunakan salah satu dari sana, kecuali:

- pesan terbaru user menunjukkan krisis;
- safety check block recommendation;
- aktivitas tidak cocok dengan intensity terbaru;
- aktivitas terlalu berat untuk energy user;
- user menolak aktivitas tersebut.

Jika tidak ada rekomendasi, pilih berdasarkan mapping:

1. Safety risk → INT010.
2. Fear → INT001 atau INT002.
3. Sadness → INT003 atau INT005.
4. Anger → INT007 atau INT002.
5. Neutral → INT003 atau INT006.
6. Joy/Love → INT008 atau INT004.

## 17. Format Respons Intervensi

Gunakan struktur:

1. Validasi.
2. Alasan singkat memilih aktivitas.
3. Langkah praktis.
4. Pertanyaan lanjutan.

Contoh:

"Kedengarannya kamu sedang cemas dan pikiranmu terasa penuh. Karena itu, aku sarankan mulai dari grounding singkat, bukan langsung memecahkan semua masalah.

Coba sebutkan 5 hal yang kamu lihat di sekitar sekarang, lalu 4 hal yang bisa kamu rasakan secara fisik.

Setelah itu, apakah rasa cemasnya sedikit berubah atau masih sama kuat?"

## 18. Larangan Umum Intervensi

Chatbot tidak boleh:

- memberi lebih dari 3 aktivitas sekaligus;
- memaksa user melakukan aktivitas;
- menyebut intervensi sebagai terapi formal;
- mengklaim aktivitas pasti berhasil;
- memberi aktivitas biasa saat krisis;
- memberi gratitude pada user yang sedang sangat sedih tanpa validasi;
- memberi problem solving sebelum validasi;
- meminta user menggali trauma saat tidak stabil.

## 19. Rekomendasi Pengembangan Dokumen Berikutnya

dokumen turunan:

- `emotions/sadness.md`
- `emotions/fear.md`
- `emotions/anger.md`
- `emotions/neutral.md`
- `emotions/joy.md`
- `emotions/love.md`
- `interventions/breathing.md`
- `interventions/grounding.md`
- `interventions/journaling-reflection.md`
- `interventions/behavioral-activation.md`
- `interventions/social-support.md`
- `interventions/safety-planning.md`

## 20. Rujukan Validasi yang Perlu Dicari

Untuk mengisi dasar akademik final, cari artikel dengan keyword:

### Breathing
- "slow breathing anxiety systematic review"
- "breathwork stress mental health meta-analysis"
- "diaphragmatic breathing anxiety randomized controlled trial"

### Grounding
- "grounding techniques anxiety intervention"
- "sensory grounding emotion regulation"
- "present focused attention anxiety"

### Journaling
- "expressive writing mental health meta-analysis"
- "journaling intervention anxiety depression systematic review"
- "therapeutic journaling mental health"

### Behavioral Activation
- "behavioral activation depression meta-analysis"
- "activity scheduling depression intervention"
- "brief behavioral activation young adults"

### Social Support
- "social support intervention loneliness mental health"
- "loneliness intervention systematic review"
- "connectedness intervention young adults"

### Problem Solving
- "problem solving therapy anxiety depression meta-analysis"
- "problem solving skills training academic stress"
- "brief problem solving therapy mental health"

### Anger Regulation
- "anger emotion regulation intervention writing"
- "expressive writing anger intervention"
- "anger management brief intervention"

### Gratitude
- "gratitude journaling wellbeing randomized trial"
- "gratitude intervention mental health meta-analysis"
- "positive psychology intervention gratitude wellbeing"

### Safety Planning
- "safety planning intervention suicide prevention"
- "Stanley Brown Safety Planning Intervention"
- "crisis response planning suicide prevention"