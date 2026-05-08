# Ruang-Rasa

Aplikasi web untuk journaling emosi dan mood tracking.

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

Jalankan migrasi database:

```bash
npm run migrate up
```

Jalankan server:

```bash
npm run dev
```

Backend jalan di `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# pastikan VITE_API_URL mengarah ke backend (http://localhost:5000/api)
npm run dev
``````

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
| `PGHOST` | Host PostgreSQL (default: `localhost`) |
| `PGPORT` | Port PostgreSQL (default: `5432`) |
| `PGUSER` | User database |
| `PGPASSWORD` | Password database |
| `PGDATABASE` | Nama database |
| `JWT_SECRET` | Secret key untuk JWT auth |

# User Database
```sql
CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```



## Scripts

```bash
# backend
npm run dev      # development (nodemon)
npm run migrate  # perintah migrasi (tambahkan up/down/create)
npm start        # production

# frontend
npm run dev      # development
npm run build    # production build
npm run lint     # cek eslint
``````

## Kontribusi

1. Buat branch baru dari `main`
2. Commit perubahan
3. Push dan buat Pull Request
