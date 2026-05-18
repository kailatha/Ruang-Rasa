# Ruang Rasa 🌿

Aplikasi web kesehatan mental yang membantu pengguna memahami kondisi emosionalnya melalui fitur screening berbasis AI, journaling, dan rekomendasi aktivitas.

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Shadcn/ui |
| **Backend** | Node.js, Express, Prisma ORM |
| **Database** | PostgreSQL |
| **AI Service** | Python (Flask/FastAPI), scikit-learn / TensorFlow |

## Arsitektur

```
┌──────────┐     ┌──────────┐     ┌─────────────┐
│ Frontend │────▶│ Backend  │────▶│ AI Service  │
│ (React)  │     │ (Express)│     │ (Python)    │
│ :5173    │     │ :5000    │     │ :8000       │
└──────────┘     └────┬─────┘     └─────────────┘
                      │
                 ┌────▼─────┐
                 │PostgreSQL│
                 │ (Prisma) │
                 └──────────┘
```

## Fitur

- 🔐 **Autentikasi** — Register, Login, JWT-based auth
- 📋 **Screening** — 10 pertanyaan skala 1-10, hasil prediksi via AI
- 📝 **Journal** — Tulis jurnal harian dengan mood tracking
- 👤 **Profil** — Kelola data diri (nama, gender, dob, pekerjaan)
- 📊 **Dashboard** — Ringkasan data pengguna

## Setup

### Prerequisites

- Node.js v18+
- PostgreSQL
- Python 3.9+ (untuk AI Service)
- npm

### 1. Clone repo

```bash
git clone https://github.com/kailatha/Ruang-Rasa.git
cd Ruang-Rasa
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — isi password DB dan JWT secret kamu
```

Buat database di PostgreSQL:

```sql
CREATE DATABASE ruang_rasa;
```

Jalankan migrasi Prisma:

```bash
npx prisma migrate dev
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
# Pastikan VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend jalan di `http://localhost:5173`

### 4. AI Service

```bash
cd ai-service
```

Buat virtual environment.

```bash
py -m venv .venv
```
Install dependency AI Service.

```bash
pip install -r requirements.txt
```

Jika `uvicorn` tidak terbaca, tetap jalankan server menggunakan format berikut:

```bash
python -m uvicorn app.main:app --reload --port 8000
```

AI Service jalan di `http://localhost:8000`

> Jika AI Service tidak berjalan, backend akan menggunakan fallback scoring.

## Environment Variables

### Backend (`.env`)

| Variable | Keterangan | Contoh |
|---|---|---|
| `DATABASE_URL` | Connection string Prisma | `postgresql://user:pass@localhost:5432/ruang_rasa` |
| `PORT` | Port backend | `5000` |
| `JWT_SECRET` | Secret key JWT | `your_secret_key` (belum diisi)|
| `JWT_EXPIRES_IN` | Masa berlaku token | `7d` |
| `AI_API_URL` | URL AI Service | `http://localhost:8000` (Kalau dideploy diganti urlnya) |

### Frontend (`.env`)

| Variable | Keterangan | Contoh |
|---|---|---|
| `VITE_API_URL` | Base URL backend API | `http://localhost:5000/api` |

## API Endpoints

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/register` | Registrasi user baru |
| `POST` | `/api/login` | Login |
| `GET` | `/api/profile` | Ambil profil (auth) |
| `PUT` | `/api/profile` | Update profil (auth) |
| `GET` | `/api/dashboard` | Data dashboard (auth) |

### Screening
| Method | Endpoint | Keterangan |
|---|---|---|
| `POST` | `/api/screening/submit` | Submit jawaban screening (auth) |
| `GET` | `/api/screening/history` | Riwayat screening (auth) |

### Journal
| Method | Endpoint | Keterangan |
|---|---|---|
| `GET` | `/api/journal` | Ambil semua jurnal (auth) |
| `POST` | `/api/journal` | Buat jurnal baru (auth) |

## Struktur Project

```
Ruang-Rasa/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Komponen UI
│   │   ├── pages/          # Halaman (login, register, screening, dll)
│   │   └── services/       # API service functions
│   └── package.json
│
├── backend/                # Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Prisma migrations
│   ├── src/
│   │   ├── controllers/    # Handler tiap endpoint
│   │   ├── middlewares/     # Auth middleware
│   │   ├── models/         # Query database (Prisma)
│   │   ├── routes/         # Definisi route API
│   │   └── lib/            # Prisma client instance
│   ├── server.js           # Entry point
│   └── package.json
│
├──  ai-service/                   # Python FastAPI service untuk model AI
│   ├── app/                       # Source code utama AI Service
│   │   ├── __init__.py            # Penanda folder app sebagai Python package
│   │   ├── main.py                # Entry point FastAPI dan endpoint API
│   │   ├── schemas.py             # Schema validasi request dan response
│   │   ├── custom_objects.py      # Custom layer/object TensorFlow
│   │   ├── model_loader.py        # Loader model, metadata, dan data pendukung
│   │   ├── inference.py           # Logic prediksi model TensorFlow
│   │   └── recommendation.py      # Logic rekomendasi aktivitas dan afirmasi
│   │
│   ├── utils/                     # Utility function AI Service
│   │   ├── __init__.py            # Penanda folder utils sebagai Python package
│   │   └── preprocessing.py       # Mapping dan preprocessing input model
│   │
│   ├── model/                     # Dokumentasi model machine learning
│   │   ├── screening_model.keras  # Model Keras hasil training
│   │   └── model_metadata.json    # Metadata fitur, label, dan konfigurasi model
│   │
│   ├── data/                      # Data pendukung rekomendasi dan mapping profil
│   │   ├── profile_name_map.json  # Mapping id profil ke nama profil user
│   │   ├── activity_bank.json     # Daftar aktivitas rekomendasi
│   │   └── affirmation_bank.json  # Daftar afirmasi atau kalimat dukungan
│   │
│   └── requirements.txt           # Dependency Python untuk AI Service
│
└── README.md
```

## Scripts

```bash
# Backend
npm run dev        # Development (nodemon)
npm start          # Production
npx prisma migrate dev    # Migrasi database
npx prisma generate       # Generate Prisma Client
npx prisma studio         # GUI database browser

# Frontend
npm run dev        # Development
npm run build      # Production build
npm run lint       # ESLint check

# AI service 
python -m uvicorn app.main:app --reload --port 8000
```

## Tim

**Kelompok Ruang Rasa** — Capstone Project DBS Foundation 2026

## Kontribusi

1. Buat branch baru dari `main`
2. Commit perubahan
3. Push dan buat Pull Request
