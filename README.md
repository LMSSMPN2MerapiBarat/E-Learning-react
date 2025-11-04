# E-Learning React – Dokumentasi Fitur

## Ringkasan
- Platform e-learning berbasis Laravel + Inertia.js + React + TypeScript dengan antarmuka yang dioptimalisasi menggunakan komponen Shadcn UI dan ikon Lucide.
- Mendukung tiga peran utama (admin, guru, siswa) dengan alur kerja yang terpisah di dalam struktur `resources/js/Pages`.
- Mengandalkan notifikasi real-time melalui `sonner` toast, dialog konfirmasi, serta pagination dan pencarian sisi-klien untuk menjaga responsivitas.
- Data utama (pengguna, kelas, materi, kuis) dikelola melalui request Inertia dan endpoint Laravel yang terintegrasi dengan model, seeder, dan ekspor/impor Excel.

## Peran & Halaman Utama

### Admin

#### Dashboard Admin (`resources/js/Pages/Admin/Dashboard.tsx` + `Components/DashboardOverview.tsx`)
- Menyajikan ringkasan total guru, siswa, materi, dan kuis dalam kartu statistik serta tab terpisah untuk melihat daftar siswa, guru, kelas, dan mata pelajaran.
- Setiap tab menyediakan pencarian instan, tampilan tabel responsif, dan kartu mobile sehingga data tetap mudah dibaca di berbagai ukuran layar.
- Fitur pagination internal menjaga performa saat menelusuri data panjang, dengan tombol navigasi halaman dan indikator jumlah total halaman.
- Data yang ditampilkan diambil langsung dari props Inertia sehingga selalu sinkron setelah aksi CRUD di halaman lain.

#### Manajemen Guru (`resources/js/Pages/Admin/Guru/GuruPage.tsx`)
- Tabel guru interaktif dengan seleksi baris untuk pengeditan cepat, bulk delete, dan penghapusan individual.
- Dialog `Create/Edit` menampilkan formulir lengkap untuk biodata, pemetaan mata pelajaran, serta memberikan validasi sisi-klien.
- Tombol import dan export Excel memanfaatkan FormData untuk unggah file dan `window.location.href` untuk unduhan, disertai indikator progres dan hasil di toast.
- Konfirmasi berlapis (dialog) memastikan tindakan berisiko seperti bulk delete dan import data tidak dilakukan tanpa persetujuan.

#### Manajemen Siswa (`resources/js/Pages/Admin/Siswa/SiswaPage.tsx`)
- Header aksi menyediakan import/export Excel, hapus semua data, hapus terpilih, dan tambah data baru dengan dialog konfirmasi berbeda untuk tiap jenis tindakan.
- Fitur pencarian, filter kelas, dan pagination manual memudahkan admin memusatkan perhatian pada subset data yang relevan.
- Komponen `SiswaTable` mendukung checkbox multi-seleksi dan tombol tindakan baris untuk edit/hapus.
- Overlay loading dan toast memberi umpan balik selama proses CRUD, import, maupun bulk delete berlangsung.

#### Manajemen Kelas (`resources/js/Pages/Admin/Kelas/KelasPage.tsx`)
- Daftar kelas dilengkapi checkbox multi-seleksi untuk bulk delete, serta dialog edit per kelas dengan pemilihan wali dan parameter lain.
- Ekspor data kelas ke Excel hanya membutuhkan satu klik, disertai toast keberhasilan setelah file siap diunduh.
- Dialog konfirmasi hadir untuk setiap penghapusan (single ataupun bulk) sehingga admin dapat meninjau ulang sebelum mengeksekusi.
- Refresh data dilakukan via `router.reload` setelah setiap aksi, menjaga tabel tetap mutakhir tanpa reload halaman penuh.

#### Manajemen Mata Pelajaran (`resources/js/Pages/Admin/Mapel/MapelPage.tsx`)
- Header menyediakan tombol tambah mapel (dialog modal) dan bulk delete ketika ada data terpilih.
- Tabel mapel menampilkan nama mapel dan guru pengampu dengan tombol edit/hapus di baris, memastikan CRUD berjalan cepat.
- Dialog `MapelDialogs` mengatur flow edit, konfirmasi hapus, serta aksi bulk delete melalui state yang terpusat.
- Toast keberhasilan/kesalahan memandu admin melihat hasil operasi tanpa perlu membuka log.

### Guru

#### Dashboard Guru (`resources/js/Pages/Guru/Dashboard.tsx`)
- Kartu statistik (`StatOverview`) menunjukkan ringkasan materi dan kuis yang dikelola guru, lengkap dengan ikon dan tren ringkas.
- `SubjectsCard` merangkum daftar mata pelajaran yang diajarkan, membantu guru melacak fokus pengajaran dengan cepat.
- Bagian materi dan kuis terbaru ditampilkan dalam grid dua kolom (`RecentMateriCard`, `RecentQuizzesCard`) untuk melihat aktivitas terkini.
- Semua konten dipaketkan dalam `TeacherLayout` yang menyertakan navigasi khusus guru dan judul halaman dinamis.

#### Kelola Materi (`resources/js/Pages/Guru/Materi/MateriPage.tsx`)
- Header list menyediakan pencarian real-time dan tombol `Unggah Materi` yang membuka dialog form terstruktur.
- Komponen `CreateMateri` dan `EditMateri` mendukung pemilihan kelas/mapel via dropdown, unggah file dengan validasi tipe, dan toast hasil.
- Daftar materi menampilkan metadata lengkap (mapel, kelas, tanggal unggah, ukuran file) serta tombol unduh, edit, hapus dengan ikon intuitif.
- Dialog konfirmasi hapus memastikan file tidak terhapus tanpa sengaja, sementara daftar otomatis memfilter berdasarkan kata kunci.

#### Kelola Kuis (`resources/js/Pages/Guru/Kuis/KuisPage.tsx`)
- Header menyediakan pencarian, tombol tambah kuis, dan membuka dialog manajemen yang menyatukan form metadata, pemilihan kelas, serta editor soal.
- `QuizMetadataFields` memungkinkan pengaturan status (draft/published), durasi, mata pelajaran, deskripsi, dan jadwal ketersediaan menggunakan toggle checkbox.
- `ClassSelector` mendukung pemilihan banyak kelas dalam sekali klik, menampilkan badge “Dipilih” untuk kelas aktif.
- `QuizQuestionsEditor` memfasilitasi penambahan, penghapusan, dan pengeditan soal beserta opsi jawaban serta penandaan jawaban benar via radio button.

### Siswa

#### Dashboard Siswa (`resources/js/Pages/Siswa/Dashboard.tsx`)
- Menampilkan peringatan apabila akun belum terhubung ke kelas, memastikan siswa tahu langkah selanjutnya.
- `StudentStatsGrid` menunjukkan jumlah materi, kuis, materi baru, dan teman sekelas secara animatif menggunakan Motion untuk pengalaman interaktif.
- `QuickActionsCard` menyediakan navigasi cepat ke halaman materi, kuis, dan nilai tanpa perlu melalui menu utama.
- Bagian materi/kuis terbaru menampilkan tiga item teratas dengan tautan langsung ke detail untuk menjaga student engagement.

#### Materi Pembelajaran (`resources/js/Pages/Siswa/Materials.tsx` + `components/StudentMaterialBrowser.tsx`)
- Siswa dapat mencari materi berdasarkan judul, deskripsi, nama guru, kelas, maupun mata pelajaran melalui input tunggal.
- Dropdown filter mata pelajaran mengelompokkan materi sesuai kebutuhan siswa (default menampilkan semua).
- Setiap kartu materi menyajikan badge tipe file, ukuran, kelas, mata pelajaran, nama guru, dan tanggal unggah.
- Tombol “Buka Materi” dan “Unduh” otomatis menyesuaikan ketersediaan URL preview/download sehingga siswa tidak mengakses file yang belum disiapkan.

#### Kuis Interaktif (`resources/js/Pages/Siswa/Quizzes.tsx` + `components/StudentQuizList.tsx`)
- Daftar kuis menampilkan status, jumlah soal, durasi, jadwal ketersediaan, dan badge kelas tujuan dalam kartu informatif.
- Tombol aksi adaptif (Mulai, Kerjakan Lagi, Belum Tersedia, Sudah Berakhir) bergantung pada jadwal dan soal yang tersedia.
- Informasi percobaan terakhir ditampilkan dalam badge hijau berisi skor dan jumlah jawaban benar untuk motivasi belajar.
- Toast error muncul ketika kuis belum siap (tidak ada soal atau di luar jadwal), menjaga siswa dari akses yang sia-sia.

#### Halaman Pengerjaan Kuis (`resources/js/Pages/Siswa/QuizExam.tsx`)
- Timer hitung mundur otomatis mengunci kuis ketika durasi habis dan memicu auto-submit bila siswa belum mengirim jawaban.
- Navigasi soal didukung animasi slide (`motion`) dengan indikator soal belum/sudah dijawab serta ringkasan jumlah jawaban yang tersisa.
- Setiap soal menampilkan pilihan jawaban dengan radio button besar, progress bar, dan badge durasi di bagian atas layar.
- Dialog konfirmasi tersedia untuk keluar kuis, submit manual, maupun menampilkan hasil akhir lengkap (skor, benar/salah, ringkasan jawaban).

#### Nilai Saya (`resources/js/Pages/Siswa/Grades.tsx`)
- Ringkasan nilai menampilkan rata-rata keseluruhan, rata-rata kuis, rata-rata tugas, dan total penilaian dengan pilihan semester.
- Filter mata pelajaran memengaruhi grafik ringkasan dan tab riwayat sehingga siswa dapat fokus pada mata pelajaran tertentu.
- `SubjectPerformanceList` merangkum jumlah penilaian dan rata-rata per mapel dengan indikator visual yang mudah dipahami.
- `GradeHistoryTabs` memisahkan daftar penilaian menjadi tab Semua, Kuis, dan Tugas agar siswa dapat melihat detail dengan cepat.

## Catatan Teknis
- Komponen layout khusus (`AdminLayout`, `TeacherLayout`, `StudentLayout`) menyelaraskan navigasi, judul halaman, dan konten utama tiap peran.
- Setiap aksi CRUD memanfaatkan `router.post/put/delete` milik Inertia disertai `router.reload({ only: [...] })` untuk menyegarkan data secara selektif.
- Toast dari `sonner` menjadi kanal utama penyampaian status proses, sementara `AlertDialog` dari Shadcn menangani konfirmasi kritis.
- Pagination sisi-klien digunakan pada tabel besar untuk mengurangi beban server dan menjaga kelincahan UI, dengan kesiapan untuk dialihkan ke server-side bila diperlukan.
 
 
 Ringkasan Per Peran

- Admin – Tambah/edit/hapus data master: guru, siswa, kelas, mata pelajaran; impor/ekspor Excel; hapus massal; atur hak akses lewat halaman dashboard dengan tabel interaktif.
- Guru – Kelola materi (unggah file, edit deskripsi, hapus) dan kuis (atur metadata, jadwal, soal, publikasi); pantau statistik dan aktivitas lewat dashboard khusus guru.
- Siswa – Lihat ringkasan progres di dashboard, akses daftar materi, mengikuti kuis dengan timer dan hasil langsung, serta meninjau riwayat nilai dan performa per mata pelajaran.