# Ruang-Rasa

**Ruang-Rasa** adalah sebuah aplikasi web fullstack yang dikembangkan sebagai Capstone Project di Universitas Diponegoro, Departemen Ilmu Komputer.

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Stack Teknologi](#-stack-teknologi)
- [Instalasi](#-instalasi)
- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Proyek](#-struktur-proyek)
- [API Endpoints](#-api-endpoints)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Kontribusi](#-kontribusi)

## ✨ Fitur

- REST API backend dengan Node.js & Express
- Frontend modern dengan React & Vite
- Database MySQL untuk penyimpanan data
- CORS enabled untuk komunikasi client-server
- Hot reload development environment
- ESLint untuk code quality

## 🛠️ Stack Teknologi

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **CORS** - Cross-origin request handling
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool & dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **ESLint** - Code linting

## 📦 Instalasi

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- MySQL Server
- npm atau yarn

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd Ruang-Rasa
```

### Step 2: Setup Backend
```bash
cd backend
npm install
```

### Step 3: Setup Frontend
```bash
cd ../frontend
npm install
```

## 🚀 Cara Menjalankan

### Database Setup
1. Buat database MySQL:
```sql
CREATE DATABASE ruang_rasa;
```

2. Buat tabel users:
```sql
CREATE TABLE users (
  User_ID INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(8) NOT NULL,
  gender VARCHAR(9),
  birth DATE,
  job VARCHAR(100),
  status VARCHAR(50)
);
```

### Menjalankan Backend

**Mode Development:**
```bash
cd backend
npm run dev
```
Server akan berjalan di `http://localhost:8080`

**Mode Production:**
```bash
cd backend
npm start
```

### Menjalankan Frontend

**Mode Development:**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

**Build untuk Production:**
```bash
cd frontend
npm run build
```

## 📁 Struktur Proyek

```
Ruang-Rasa/
├── backend/
│   ├── db.js              # Database connection configuration
│   ├── index.js           # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (create this)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # Entry point
│   │   ├── App.css        # Styles
│   │   ├── index.css      # Global styles
│   │   └── assets/        # Static assets
│   ├── public/            # Public static files
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   ├── eslint.config.js   # ESLint configuration
│   ├── package.json       # Frontend dependencies
│   └── README.md
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Users
- **GET** `/api/users` - Ambil semua users
  - Response: Array of user objects

Contoh response:
```json
[
  {
    "User_ID": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "password": "pass1234",
    "gender": "Male",
    "birth": "1999-05-15",
    "job": "Software Engineer",
    "status": "Active"
  }
]
```

## ⚙️ Konfigurasi Environment

### Backend (.env)

Buat file `.env` di folder `backend`:

```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ruang_rasa
DB_PORT=3306
NODE_ENV=development
```

### Frontend

Frontend terhubung ke backend melalui `http://localhost:8080` (dapat dikonfigurasi di file `vite.config.js` jika diperlukan)

## 📝 Scripts Available

### Backend
- `npm start` - Jalankan server production
- `npm run dev` - Jalankan server dengan hot reload
- `npm test` - Menjalankan test (belum dikonfigurasi)

### Frontend
- `npm run dev` - Jalankan dev server
- `npm run build` - Build untuk production
- `npm run preview` - Preview build hasil
- `npm run lint` - Cek kualitas code dengan ESLint

## 🐛 Troubleshooting

### Error: ECONNREFUSED (Database)
- Pastikan MySQL Server berjalan
- Periksa konfigurasi environment di `.env`
- Verifikasi credentials database

### Error: CORS Policy
- Pastikan `corsOptions.origin` di `backend/index.js` sesuai dengan URL frontend
- Default frontend URL: `http://localhost:5173`

### Error: Port Already in Use
- Backend: Change `PORT` di `.env`
- Frontend: Change port di `npm run dev` atau konfigurasi vite

## 📚 Dokumentasi Lebih Lanjut

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 👥 Kontribusi

Proyek ini adalah capstone project. Untuk perubahan atau perbaikan:

1. Buat branch baru (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push ke branch (`git push origin feature/AmazingFeature`)
4. Buka Pull Request

## 📄 Lisensi

ISC License - Lihat file `LICENSE` untuk detail lebih lanjut.

---

**Terakhir diperbarui:** April 2026

Untuk pertanyaan atau bantuan, hubungi tim development.
