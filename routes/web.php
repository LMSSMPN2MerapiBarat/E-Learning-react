<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;

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
// 🔒 ROUTE ADMIN
// =============================
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // ✅ Dashboard Admin (gunakan method dari controller)
        Route::get('/dashboard', [AdminUserController::class, 'dashboard'])->name('dashboard');

        // ✅ Halaman Kelola Siswa (CRUD)
        Route::get('/siswa/Siswa', function () {
            return Inertia::render('admin/siswa/Siswa', [
                'students' => \App\Models\User::where('role', 'siswa')->get([
                    'id', 'name', 'email', 'kelas', 'no_telp', 'nis',
                ]),
            ]);
        })->name('siswa.index');

        // ✅ CRUD User (Admin)
        Route::resource('users', AdminUserController::class);

        // ✅ Import / Export / Bulk Delete
        Route::post('/users/import', [AdminUserController::class, 'importExcel'])->name('users.import');
        Route::get('/users/export/{role}', [AdminUserController::class, 'exportExcel'])->name('users.export');
        Route::delete('/users/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('users.bulk-delete');
    });

// =============================
// 👨‍🏫 ROUTE GURU
// =============================
Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('guru/Dashboard'))->name('dashboard');
    });

// =============================
// 🎓 ROUTE SISWA
// =============================
Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('siswa/Dashboard'))->name('dashboard');
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
