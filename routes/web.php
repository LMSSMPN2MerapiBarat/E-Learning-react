<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminKelasController;
use App\Models\User;
use App\Models\Kelas;

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

        /*
        |--------------------------------------------------------------------------
        | 🏫 KELOLA KELAS
        |--------------------------------------------------------------------------
        */
        Route::prefix('kelas')->name('kelas.')->group(function () {
            Route::get('/Kelas', [AdminKelasController::class, 'index'])->name('index');
            Route::get('/Create', [AdminKelasController::class, 'create'])->name('create');
            Route::post('/', [AdminKelasController::class, 'store'])->name('store');

            // ✅ Bulk Delete HARUS sebelum route {id}
            Route::delete('/bulk-delete', [AdminKelasController::class, 'bulkDelete'])
                ->name('bulk-delete');

            // ✅ Route dengan parameter ID dibatasi hanya angka
            Route::get('/{id}/Edit', [AdminKelasController::class, 'edit'])
                ->whereNumber('id')->name('edit');
            Route::put('/{id}', [AdminKelasController::class, 'update'])
                ->whereNumber('id')->name('update');
            Route::delete('/{id}', [AdminKelasController::class, 'destroy'])
                ->whereNumber('id')->name('destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | ⚙️ CRUD USER ADMIN
        |--------------------------------------------------------------------------
        */
        Route::resource('users', AdminUserController::class);

        // ✅ Import / Export / Bulk Delete User
        Route::post('/users/import', [AdminUserController::class, 'importExcel'])->name('users.import');
        Route::get('/users/export/{role}', [AdminUserController::class, 'exportExcel'])->name('users.export');
        Route::post('/users/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('users.bulk-delete');

        /*
        |--------------------------------------------------------------------------
        | 📘 API UNTUK DROPDOWN KELAS (DIPAKAI DI CreateSiswa.tsx)
        |--------------------------------------------------------------------------
        */
        Route::get('/kelas/list', function () {
            return Kelas::select('id', 'tingkat', 'nama_kelas', 'tahun_ajaran')->get();
        })->name('kelas.list');
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
