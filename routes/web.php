<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Models\User;

// =============================
// 🌐 HALAMAN UTAMA (PUBLIC)
// =============================
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// =============================
// 🧭 DASHBOARD UMUM
// =============================
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// =============================
// 🔒 ROUTE BERDASARKAN ROLE
// =============================

// 🧩 ADMIN
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // DASHBOARD ADMIN
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard', [
                'students' => User::where('role', 'siswa')->get([
                    'id', 'name', 'email', 'kelas', 'no_telp', 'nis',
                ]),
                'totalGuru' => User::where('role', 'guru')->count(),
                'totalSiswa' => User::where('role', 'siswa')->count(),
                // sementara 0 kalau model belum ada
                'totalMateri' => 0,
                'totalKuis' => 0,
            ]);
        })->name('dashboard');

        // CRUD user + import/export Excel
        Route::resource('users', AdminUserController::class);
        Route::post('/users/import', [AdminUserController::class, 'importExcel'])->name('users.import');
        Route::get('/users/export/{role}', [AdminUserController::class, 'exportExcel'])->name('users.export');
        Route::delete('/users/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('users.bulk-delete');
    });

// 📘 GURU
Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('guru/dashboard');
        })->name('dashboard');
    });

// 🎓 SISWA
Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('siswa/dashboard');
        })->name('dashboard');
    });

// =============================
// 👤 PROFIL PENGGUNA
// =============================
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// =============================
// 🔐 AUTH
// =============================
require __DIR__ . '/auth.php';
