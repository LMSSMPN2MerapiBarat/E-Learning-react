<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminKelasController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| 🌐 HALAMAN UTAMA (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'      => Route::has('login'),
        'canRegister'   => Route::has('register'),
        'laravelVersion'=> Application::VERSION,
        'phpVersion'    => PHP_VERSION,
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
    $students = \App\Models\User::where('role', 'siswa')
        ->with(['kelas:id,nama_kelas'])
        ->get()
        ->map(function ($u) {
            // Jika relasi belum dimuat atau null, jadikan Collection kosong
            $kelasCollection = $u->getRelation('kelas') ?? collect();
            // Ambil kelas pertama (jika siswa hanya punya 1 kelas)
            $kelas = $kelasCollection->first();

            return [
                'id'       => $u->id,
                'name'     => $u->name,
                'email'    => $u->email,
                'nis'      => $u->nis,
                'no_telp'  => $u->no_telp,
                'kelas'    => $kelas?->nama_kelas ?? '-', // nama kelas
                'kelas_id' => $kelas?->id ?? null,        // ID kelas
            ];
        });

    return Inertia::render('admin/siswa/Siswa', [
        'students' => $students,
    ]);
})->name('siswa.index');


        /*
        |--------------------------------------------------------------------------
        | 👨‍🏫 KELOLA GURU
        |--------------------------------------------------------------------------
        */
        Route::get('/guru/Guru', function () {
            return Inertia::render('admin/Guru/Guru', [
                // Sementara masih pakai kolom legacy, karena halaman Guru masih migrasi
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

            // 📘 API untuk dropdown kelas (dipakai di Create/Edit Siswa)
            Route::get('/list', [AdminKelasController::class, 'list'])->name('list');
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
