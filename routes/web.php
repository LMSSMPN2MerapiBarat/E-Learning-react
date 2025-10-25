<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| 🌐 HALAMAN UTAMA (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/*
|--------------------------------------------------------------------------
| 🧭 DASHBOARD UMUM
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| 🔒 ROUTE ADMIN
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // ✅ Dashboard Admin
        Route::get('/dashboard', [AdminUserController::class, 'dashboard'])->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | 🎓 KELOLA SISWA
        |--------------------------------------------------------------------------
        */
        Route::get('/siswa/Siswa', function () {
            return Inertia::render('admin/siswa/Siswa', [
                'students' => User::where('role', 'siswa')->get([
                    'id', 'name', 'email', 'kelas', 'no_telp', 'nis',
                ]),
            ]);
        })->name('siswa.index');

        /*
        |--------------------------------------------------------------------------
        | 👨‍🏫 KELOLA GURU
        |--------------------------------------------------------------------------
        */
        Route::get('/guru/Guru', function () {
            return Inertia::render('admin/Guru/Guru', [
                'gurus' => User::where('role', 'guru')->get([
                    'id', 'name', 'nip', 'email', 'mapel', 'no_telp',
                ]),
            ]);
        })->name('guru.index');

        // CRUD untuk guru
        // Route::post('/gurus', [AdminUserController::class, 'storeGuru'])->name('gurus.store');
        // Route::put('/gurus/{id}', [AdminUserController::class, 'updateGuru'])->name('gurus.update');
        // Route::delete('/gurus/{id}', [AdminUserController::class, 'destroyGuru'])->name('gurus.destroy');

        /*
        |--------------------------------------------------------------------------
        | ⚙️ CRUD USER ADMIN
        |--------------------------------------------------------------------------
        */
        Route::resource('users', AdminUserController::class);

        // ✅ Import / Export / Bulk Delete
        Route::post('/users/import', [AdminUserController::class, 'importExcel'])->name('users.import');
        Route::get('/users/export/{role}', [AdminUserController::class, 'exportExcel'])->name('users.export');

        // ✅ Bulk Delete via POST (bisa untuk guru dan siswa)
        Route::post('/users/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('users.bulk-delete');
        // Route::post('/students/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('students.bulk-delete');
        // Route::post('/gurus/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('gurus.bulk-delete');
    });

/*
|--------------------------------------------------------------------------
| 👨‍🏫 ROUTE GURU
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('guru/Dashboard'))->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| 🎓 ROUTE SISWA
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('siswa/Dashboard'))->name('dashboard');
    });

/*
|--------------------------------------------------------------------------
| 👤 PROFIL PENGGUNA
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| 🔐 AUTH
|--------------------------------------------------------------------------
*/
require __DIR__ . '/auth.php';
