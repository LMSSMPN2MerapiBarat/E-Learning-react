<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminKelasController;
use App\Http\Controllers\AdminMapelController; // ✅ tambahkan controller baru
use App\Models\User;

/*
|--------------------------------------------------------------------------
| 🌐 HALAMAN UTAMA (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
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
            $students = User::where('role', 'siswa')
                ->with(['kelas:id,kelas'])
                ->get()
                ->map(function ($u) {
                    $kelasCollection = $u->getRelation('kelas') ?? collect();
                    $kelas = $kelasCollection->first();

                    return [
                        'id'       => $u->id,
                        'name'     => $u->name,
                        'email'    => $u->email,
                        'nis'      => $u->nis,
                        'no_telp'  => $u->no_telp,
                        'kelas'    => $kelas?->kelas ?? '-',
                        'kelas_id' => $kelas?->id ?? null,
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
            Route::delete('/bulk-delete', [AdminKelasController::class, 'bulkDelete'])->name('bulk-delete');
            Route::get('/{id}/Edit', [AdminKelasController::class, 'edit'])->whereNumber('id')->name('edit');
            Route::put('/{id}', [AdminKelasController::class, 'update'])->whereNumber('id')->name('update');
            Route::delete('/{id}', [AdminKelasController::class, 'destroy'])->whereNumber('id')->name('destroy');
            Route::get('/list', [AdminKelasController::class, 'list'])->name('list');
        });

        /*
        |--------------------------------------------------------------------------
        | 📘 KELOLA MATA PELAJARAN
        |--------------------------------------------------------------------------
        */
        Route::prefix('mapel')->name('mapel.')->group(function () {
            Route::get('/Mapel', [AdminMapelController::class, 'index'])->name('index');
            Route::get('/Create', [AdminMapelController::class, 'create'])->name('create');
            Route::post('/', [AdminMapelController::class, 'store'])->name('store');
            Route::get('/{mapel}/Edit', [AdminMapelController::class, 'edit'])->name('edit');
            Route::put('/{mapel}', [AdminMapelController::class, 'update'])->name('update');
            Route::delete('/{mapel}', [AdminMapelController::class, 'destroy'])->name('destroy');
            Route::delete('/bulk-delete', [AdminMapelController::class, 'bulkDelete'])->name('bulk-delete');
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
