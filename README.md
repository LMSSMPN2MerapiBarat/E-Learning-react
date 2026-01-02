# E-Learning SMPN 2 Merapi Barat

Platform pembelajaran daring (e-learning) berbasis web untuk SMPN 2 Merapi Barat. Aplikasi ini memungkinkan guru untuk mengelola materi dan kuis, siswa untuk mengakses pembelajaran secara interaktif, dan admin untuk mengelola seluruh data master sekolah.

---

## Fitur Utama

### Admin
- Dashboard statistik (guru, siswa, materi, kuis)
- Manajemen data guru dengan import/export Excel
- Manajemen data siswa dengan import/export Excel
- Manajemen kelas dan wali kelas
- Manajemen mata pelajaran

### Guru
- Dashboard aktivitas terkini
- Upload dan kelola materi pembelajaran (PDF, Word, PowerPoint, Video)
- Buat dan kelola kuis interaktif dengan timer
- Atur jadwal ketersediaan kuis
- Lihat statistik materi dan kuis

### Siswa
- Dashboard progres belajar
- Akses materi pembelajaran dengan filter pencarian
- Kerjakan kuis dengan timer otomatis
- Lihat hasil dan riwayat nilai
- Statistik performa per mata pelajaran

---

## Tech Stack

### Backend
| Teknologi | Versi |
|-----------|-------|
| PHP | ^8.3 |
| Laravel Framework | ^12.0 |
| Laravel Breeze | ^2.3 |
| Inertia.js (Laravel) | ^2.0 |
| Laravel Sanctum | ^4.0 |
| Maatwebsite Excel | ^3.1 |

### Frontend
| Teknologi | Versi |
|-----------|-------|
| React | ^18.3.1 |
| TypeScript | ^5.0.2 |
| Vite | ^7.0.7 |
| TailwindCSS | ^3.2.1 |
| Radix UI Components | Latest |
| Lucide React (Icons) | ^0.546.0 |
| Motion (Animasi) | ^12.23.24 |
| Recharts (Grafik) | ^3.5.1 |

### Database
- MySQL

### Testing
| Teknologi | Versi |
|-----------|-------|
| Pest PHP | ^4.1 |
| Vitest | ^4.0.16 |
| Testing Library React | ^16.3.1 |

---

## Prasyarat

Pastikan sistem Anda sudah terinstall:

- **PHP** >= 8.3
- **Composer** >= 2.0
- **Node.js** >= 20.x
- **npm** >= 10.x
- **MySQL** >= 8.0
- **Git**

---

## Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/LMSSMPN2MerapiBarat/E-Learning-react.git
cd E-Learning-react
```

### 2. Setup Menggunakan Script Otomatis

Jalankan perintah berikut untuk setup cepat:

```bash
composer setup
```

Script ini akan otomatis:
- Menginstall dependensi Composer
- Menyalin `.env.example` ke `.env`
- Generate application key
- Menjalankan migrasi database
- Menginstall dependensi npm
- Build asset frontend

### 3. Setup Manual (Alternatif)

Jika ingin setup secara manual:

```bash
# Install dependensi PHP
composer install

# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Konfigurasi database di file .env
# Sesuaikan DB_DATABASE, DB_USERNAME, DB_PASSWORD

# Jalankan migrasi database
php artisan migrate

# (Opsional) Jalankan seeder untuk data dummy
php artisan db:seed

# Install dependensi JavaScript
npm install

# Build asset frontend
npm run build
```

### 4. Menjalankan Development Server

Jalankan server development dengan satu perintah:

# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev


### 5. Akses Aplikasi

Buka browser dan akses:
- **Aplikasi**: http://localhost:8000
- **Vite HMR**: http://localhost:5173

---

## Menjalankan dengan Docker

Project ini mendukung deployment dengan Docker:

```bash
# Build image
docker build -t e-learning-smpn2 .

# Jalankan container
docker run -p 8080:8080 \
  -e DB_CONNECTION=mysql \
  -e DB_HOST=your_db_host \
  -e DB_DATABASE=your_database \
  -e DB_USERNAME=your_username \
  -e DB_PASSWORD=your_password \
  e-learning-smpn2
```

---

## Menjalankan Testing

### Backend Testing (Pest PHP)

```bash
# Jalankan semua test
composer test

# Atau langsung dengan Pest
php vendor/bin/pest

# Test dengan coverage
php vendor/bin/pest --coverage
```

### Frontend Testing (Vitest)

```bash
# Jalankan test sekali
npm run test

# Jalankan test dengan watch mode
npm run test:watch

# Jalankan test dengan coverage
npm run test:coverage
```

---

## Struktur Direktori

```
E-Learning-react/
├── app/                    # Logic aplikasi Laravel
│   ├── Http/Controllers/   # Controller
│   ├── Models/             # Eloquent Models
│   └── ...
├── config/                 # Konfigurasi Laravel
├── database/
│   ├── factories/          # Model factories
│   ├── migrations/         # Database migrations
│   └── seeders/            # Database seeders
├── public/                 # Asset publik
├── resources/
│   ├── js/
│   │   ├── Components/     # Komponen React reusable
│   │   ├── Layouts/        # Layout (Admin, Guru, Siswa)
│   │   ├── Pages/          # Halaman Inertia
│   │   │   ├── Admin/      # Halaman Admin
│   │   │   ├── Guru/       # Halaman Guru
│   │   │   ├── Siswa/      # Halaman Siswa
│   │   │   ├── LandingPage/# Landing Page publik
│   │   │   └── Auth/       # Halaman autentikasi
│   │   └── lib/            # Utilities & helpers
│   └── views/              # Blade templates
├── routes/                 # Route definitions
├── storage/                # File storage
├── tests/
│   ├── Feature/            # Feature tests
│   └── Unit/               # Unit tests
├── .env.example            # Template environment
├── composer.json           # Dependensi PHP
├── package.json            # Dependensi JavaScript
├── Dockerfile              # Docker configuration
├── vite.config.js          # Vite configuration
└── tailwind.config.js      # TailwindCSS configuration
```

---

## Konfigurasi Environment

Salin `.env.example` ke `.env` dan sesuaikan konfigurasi berikut:

```env
APP_NAME="SMPN 2 Merapi Barat"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e_learning
DB_USERNAME=root
DB_PASSWORD=your_password
```

---

## Dokumentasi Fitur

### Peran Pengguna

| Peran | Deskripsi |
|-------|-----------|
| **Admin** | Mengelola data master: guru, siswa, kelas, mata pelajaran; import/export Excel; bulk delete |
| **Guru** | Mengelola materi dan kuis; mengatur jadwal kuis; melihat statistik |
| **Siswa** | Mengakses materi; mengerjakan kuis dengan timer; melihat riwayat nilai |

### Komponen UI

Aplikasi menggunakan komponen UI modern:
- **Radix UI** - Komponen aksesibel dan unstyled
- **Shadcn UI** - Komponen yang sudah di-style dengan TailwindCSS
- **Lucide Icons** - Ikon SVG yang konsisten
- **Motion** - Animasi halus untuk UX yang lebih baik
- **Sonner** - Toast notifications
- **Recharts** - Visualisasi data grafik

---

## Kontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

## Tim Pengembang

**SMPN 2 Merapi Barat - Capstone Project**

---

<p align="center">
  <sub>Built with Laravel, React, and TypeScript</sub>
</p>