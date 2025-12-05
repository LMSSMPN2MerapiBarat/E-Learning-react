<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminKelasController;
use App\Http\Controllers\AdminMapelController;
use App\Http\Controllers\AdminGuruController;
use App\Http\Controllers\AdminSiswaController;
use App\Http\Controllers\AdminClassScheduleController;
use App\Http\Controllers\Guru\AssignmentController as GuruAssignmentController;
use App\Http\Controllers\Guru\AssignmentSubmissionController as GuruAssignmentSubmissionController;
use App\Http\Controllers\Guru\DashboardController as GuruDashboardController;
use App\Http\Controllers\Guru\MateriController as GuruMateriController;
use App\Http\Controllers\Guru\QuizController as GuruQuizController;
use App\Http\Controllers\Guru\KelasController as GuruKelasController;
use App\Http\Controllers\Siswa\DashboardController as SiswaDashboardController;
use App\Http\Controllers\Siswa\AssignmentController as SiswaAssignmentController;
use App\Http\Controllers\Siswa\MateriController as SiswaMateriController;
use App\Http\Controllers\Siswa\QuizAttemptController as SiswaQuizAttemptController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();

    if (! $user) {
        return redirect()->route('login');
    }

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'guru'  => redirect()->route('guru.dashboard'),
        'siswa' => redirect()->route('siswa.dashboard'),
        default => redirect()->route('login')->withErrors([
            'role' => 'Role tidak dikenali.',
        ]),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // 🧭 Dashboard
        Route::get('/dashboard', [AdminUserController::class, 'dashboard'])->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | KELOLA SISWA
        |--------------------------------------------------------------------------
        */
        Route::get('/siswa/Siswa', [AdminSiswaController::class, 'index'])->name('siswa.index');
        Route::delete('/siswa/delete-all', [AdminSiswaController::class, 'destroyAll'])->name('siswa.delete-all');

        /*
        |--------------------------------------------------------------------------
        | KELOLA GURU
        |--------------------------------------------------------------------------
        */
        Route::prefix('guru')->name('guru.')->group(function () {
            Route::get('/Guru', [AdminGuruController::class, 'index'])->name('index');
            Route::post('/', [AdminGuruController::class, 'store'])->name('store');

            // ⚠️ letakkan bulk delete di atas {guru}
            Route::delete('/bulk-delete', [AdminGuruController::class, 'bulkDelete'])->name('bulk-delete');

            Route::put('/{guru}', [AdminGuruController::class, 'update'])->name('update');
            Route::delete('/{guru}', [AdminGuruController::class, 'destroy'])->name('destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | KELOLA KELAS
        |--------------------------------------------------------------------------
        */
        Route::prefix('kelas')->name('kelas.')->group(function () {
            Route::get('/Kelas', [AdminKelasController::class, 'index'])->name('index');
            Route::get('/Create', [AdminKelasController::class, 'create'])->name('create');
            Route::post('/', [AdminKelasController::class, 'store'])->name('store');
            Route::get('/export', [AdminKelasController::class, 'export'])->name('export');
            Route::get('/{id}/detail', [AdminKelasController::class, 'detail'])
                ->whereNumber('id')
                ->name('detail');
            Route::delete('/bulk-delete', [AdminKelasController::class, 'bulkDelete'])->name('bulk-delete');
            Route::get('/{id}/Edit', [AdminKelasController::class, 'edit'])->whereNumber('id')->name('edit');
            Route::put('/{id}', [AdminKelasController::class, 'update'])->whereNumber('id')->name('update');
            Route::delete('/{id}', [AdminKelasController::class, 'destroy'])->whereNumber('id')->name('destroy');
            Route::get('/list', [AdminKelasController::class, 'list'])->name('list');
        });

        /*
        |--------------------------------------------------------------------------
        | KELOLA MAPEL
        |--------------------------------------------------------------------------
        */
        Route::prefix('mapel')->name('mapel.')->group(function () {
            Route::get('/Mapel', [AdminMapelController::class, 'index'])->name('index');
            Route::get('/Create', [AdminMapelController::class, 'create'])->name('create');
            Route::post('/', [AdminMapelController::class, 'store'])->name('store');

            // ⚠️ letakkan bulk delete di atas {mapel}
            Route::delete('/bulk-delete', [AdminMapelController::class, 'bulkDelete'])->name('bulk-delete');

            Route::get('/{mapel}/detail', [AdminMapelController::class, 'detail'])
                ->name('detail');
            Route::get('/{mapel}/Edit', [AdminMapelController::class, 'edit'])->name('edit');
            Route::put('/{mapel}', [AdminMapelController::class, 'update'])->name('update');
            Route::delete('/{mapel}', [AdminMapelController::class, 'destroy'])->name('destroy');
            Route::get('/list', [AdminMapelController::class, 'list'])->name('list');
        });

        /*
        |--------------------------------------------------------------------------
        | KELOLA JADWAL KELAS
        |--------------------------------------------------------------------------
        */
        Route::prefix('jadwal-kelas')->name('jadwal-kelas.')->group(function () {
            Route::get('/Jadwal', [AdminClassScheduleController::class, 'index'])->name('index');
            Route::get('/Create', [AdminClassScheduleController::class, 'create'])->name('create');
            Route::post('/', [AdminClassScheduleController::class, 'store'])->name('store');
            Route::get('/{schedule}/Edit', [AdminClassScheduleController::class, 'edit'])
                ->whereNumber('schedule')
                ->name('edit');
            Route::put('/{schedule}', [AdminClassScheduleController::class, 'update'])
                ->whereNumber('schedule')
                ->name('update');
            Route::delete('/{schedule}', [AdminClassScheduleController::class, 'destroy'])
                ->whereNumber('schedule')
                ->name('destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | USER MANAGEMENT (Import / Export / Bulk Delete)
        |--------------------------------------------------------------------------
        */
        Route::resource('users', AdminUserController::class);
        Route::post('/users/import', [AdminUserController::class, 'importExcel'])->name('users.import');
        Route::get('/users/export/{role}', [AdminUserController::class, 'exportExcel'])->name('users.export');
        Route::post('/users/bulk-delete', [AdminUserController::class, 'bulkDelete'])->name('users.bulk-delete');
    });

/*
|--------------------------------------------------------------------------
| PROFIL (SEMUA ROLE)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| GURU ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:guru'])
    ->prefix('guru')
    ->name('guru.')
    ->group(function () {
        Route::get('/dashboard', [GuruDashboardController::class, 'index'])->name('dashboard');

        Route::get('/materi', [GuruMateriController::class, 'index'])->name('materi.index');
        Route::post('/materi', [GuruMateriController::class, 'store'])->name('materi.store');
        Route::put('/materi/{materi}', [GuruMateriController::class, 'update'])->name('materi.update');
        Route::delete('/materi/{materi}', [GuruMateriController::class, 'destroy'])->name('materi.destroy');
        Route::get('/materi/{materi}/download', [GuruMateriController::class, 'download'])->name('materi.download');

        Route::get('/kelas', [GuruKelasController::class, 'index'])->name('kelas.index');

        Route::get('/kuis', [GuruQuizController::class, 'index'])->name('kuis.index');
        Route::get('/kuis/{quiz}', [GuruQuizController::class, 'show'])
            ->whereNumber('quiz')
            ->name('kuis.show');
        Route::post('/kuis', [GuruQuizController::class, 'store'])->name('kuis.store');
        Route::put('/kuis/{quiz}', [GuruQuizController::class, 'update'])->name('kuis.update');
        Route::delete('/kuis/{quiz}', [GuruQuizController::class, 'destroy'])->name('kuis.destroy');

        Route::prefix('tugas')->name('tugas.')->group(function () {
            Route::get('/', [GuruAssignmentController::class, 'index'])->name('index');
            Route::post('/', [GuruAssignmentController::class, 'store'])->name('store');
            Route::get('/{assignment}/export', [GuruAssignmentController::class, 'exportGrades'])
                ->whereNumber('assignment')
                ->name('export');
            Route::get('/{assignment}', [GuruAssignmentController::class, 'show'])
                ->whereNumber('assignment')
                ->name('show');
            Route::put('/{assignment}', [GuruAssignmentController::class, 'update'])
                ->whereNumber('assignment')
                ->name('update');
            Route::delete('/{assignment}', [GuruAssignmentController::class, 'destroy'])
                ->whereNumber('assignment')
                ->name('destroy');
        });

        Route::put('/tugas/submissions/{submission}', [GuruAssignmentSubmissionController::class, 'update'])
            ->whereNumber('submission')
            ->name('tugas.submissions.update');
    });

/*
|--------------------------------------------------------------------------
| SISWA ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:siswa'])
    ->prefix('siswa')
    ->name('siswa.')
    ->group(function () {
        Route::get('/dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');
        Route::get('/materi', [SiswaDashboardController::class, 'materials'])->name('materials');
        Route::get('/kuis', [SiswaDashboardController::class, 'quizzes'])->name('quizzes');
        Route::get('/jadwal', [SiswaDashboardController::class, 'schedule'])->name('schedule');
        Route::get('/quizzes/{quiz}', [SiswaQuizAttemptController::class, 'show'])
            ->whereNumber('quiz')
            ->name('quizzes.show');
        Route::get('/quizzes/{quiz}/attempts/{attempt}', [SiswaQuizAttemptController::class, 'detail'])
            ->whereNumber('quiz')
            ->whereNumber('attempt')
            ->name('quizzes.attempts.show');
        Route::get('/nilai', [SiswaDashboardController::class, 'grades'])->name('grades');
        Route::get('/materi/{materi}/preview', [SiswaMateriController::class, 'preview'])->name('materials.preview');
        Route::get('/materi/{materi}/download', [SiswaMateriController::class, 'download'])->name('materials.download');
        Route::post('/quizzes/{quiz}/attempts', [SiswaQuizAttemptController::class, 'store'])->name('quizzes.attempts.store');
        Route::get('/mata-pelajaran', [SiswaDashboardController::class, 'subjects'])->name('subjects');
        Route::get('/tugas', [SiswaAssignmentController::class, 'index'])->name('tugas.index');
        Route::post('/tugas/{assignment}/draft', [SiswaAssignmentController::class, 'saveDraft'])
            ->whereNumber('assignment')
            ->name('tugas.draft');
        Route::post('/tugas/{assignment}/submit', [SiswaAssignmentController::class, 'submit'])
            ->whereNumber('assignment')
            ->name('tugas.submit');
        Route::post('/tugas/{assignment}/cancel', [SiswaAssignmentController::class, 'cancel'])
            ->whereNumber('assignment')
            ->name('tugas.cancel');
    });

require __DIR__ . '/auth.php';
