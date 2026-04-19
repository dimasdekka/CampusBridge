# CampusBridge Backend

CampusBridge Backend adalah REST API yang dibangun dengan Node.js, Express, dan Prisma ORM untuk mendukung aplikasi kolaborasi akademik antara mahasiswa dan dosen. Backend ini menyediakan autentikasi JWT, manajemen user, penjadwalan bimbingan, serta integrasi dengan Stream Chat & Video.

## Fitur

- Autentikasi dan otorisasi user (JWT)
- Manajemen user (register, login, update profil)
- Penjadwalan dan manajemen bimbingan (Supervision)
- Integrasi Stream Chat & Video (sinkronisasi user, token, dsb)
- Seed & migrasi database (Prisma)

## Prasyarat

- Node.js (v16 atau lebih baru)
- npm
- Database SQL (PostgreSQL/MySQL/SQL Server, sesuai konfigurasi Prisma)
- Akun dan kredensial Stream (API Key & Secret)

## Environment Setup

1. Clone repository:
   ```bash
   git clone https://github.com/dimasdekka/CampusBridgeAPI
   cd backend
   ```
2. Buat file `.env` dan isi variabel berikut:
   ```env
   PORT=3000
   DATABASE_URL=your_database_url
   SALT=$2b$10$.MftzcPPsR5TUTYRYWGyQu
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   JWT_SECRET=your_jwt_secret
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Menjalankan API

**Development mode:**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm start
```

API akan tersedia di http://localhost:3000

## Migrasi & Seed Database

```bash
npx prisma migrate deploy
npm run seed
```

## Dokumentasi API

### Authentication Endpoints

- `POST /auth/register` - Register user baru (mahasiswa/dosen)
- `POST /auth/login` - Login user
- `PUT /auth/profile` - Update profil user (nama, dsb)

### Supervision Endpoints

- `POST /supervisions` - Jadwalkan bimbingan baru
- `GET /supervisions` - Ambil seluruh data bimbingan user
- `PATCH /supervisions/:id` - Update status bimbingan

## 🚀 Lanjutan

- Untuk integrasi Stream, pastikan API Key & Secret valid.
- Untuk seed database, hapus data supervision sebelum user untuk menghindari error unique constraint.
- Dokumentasi lebih lanjut tersedia di folder [`Disini`](https://github.com/dimasdekka/CampusBridge/blob/main/README.md) dan komentar kode.
