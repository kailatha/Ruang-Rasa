# Ruang-Rasa

Aplikasi web untuk journaling emosi dan mood tracking. Capstone Project — Departemen Ilmu Komputer, Universitas Diponegoro.

## Tech Stack

**Backend:** Node.js, Express, PostgreSQL  
**Frontend:** React, Vite

## Setup

### Prerequisites

- Node.js v18+
- PostgreSQL
- npm

### 1. Clone repo

```bash
git clone <repository-url>
cd Ruang-Rasa
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env, isi password DB kamu
```

Buat database-nya dulu di PostgreSQL:

```sql
CREATE DATABASE ruang_rasa;
```

Jalankan:

```bash
npm run dev
```

Backend jalan di `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend jalan di `http://localhost:5173`

## Struktur Backend

```
backend/
├── src/
│   ├── config/         # koneksi DB, dsb
│   ├── controllers/    # handler tiap endpoint
│   ├── middlewares/     # auth, error handler
│   ├── models/         # query database
│   ├── routes/         # definisi route API
│   ├── services/       # business logic
│   └── utils/          # helper functions
├── server.js           # entry point
├── .env
├── .env.example
└── package.json
```

## Environment Variables

Lihat `.env.example` untuk daftar lengkap. Yang wajib diisi:

| Variable | Keterangan |
|---|---|
| `DB_HOST` | Host PostgreSQL (default: `localhost`) |
| `DB_PORT` | Port PostgreSQL (default: `5432`) |
| `DB_USER` | User database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Nama database |
| `JWT_SECRET` | Secret key untuk JWT auth |

## Scripts

```bash
# backend
npm run dev     # development (nodemon)
npm start       # production

# frontend
npm run dev     # development
npm run build   # production build
npm run lint    # cek eslint
```

## Kontribusi

1. Buat branch baru dari `main`
2. Commit perubahan
3. Push dan buat Pull Request

---

Capstone Project 2026 — Universitas Diponegoro
