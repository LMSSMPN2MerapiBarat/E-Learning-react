<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\Siswa;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()
            ->with(['kelas', 'mataPelajaran'])
            ->firstOrFail();

        $kelasCollection = $guru->kelas ?? collect();
        $kelasIds = $kelasCollection->pluck('id');

        $materiCount = $guru->materis()->count();
        $quizCount   = $guru->quizzes()->count();
        $kelasCount  = $kelasCollection->count();
        $studentCount = Siswa::whereIn('kelas_id', $kelasIds)->count();

        $recentMateri = Materi::with(['kelas', 'mataPelajaran'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($materi) {
                return [
                    'id'          => $materi->id,
                    'judul'       => $materi->judul,
                    'deskripsi'   => $materi->deskripsi,
                    'kelas'       => optional($materi->kelas)->kelas,
                    'tingkat'     => optional($materi->kelas)->tingkat,
                    'mapel'       => optional($materi->mataPelajaran)->nama_mapel,
                    'created_at'  => $materi->created_at?->toIso8601String(),
                    'file_name'   => $materi->file_name,
                    'file_mime'   => $materi->file_mime,
                    'file_size'   => $materi->file_size,
                    'file_url'    => $materi->file_path ? Storage::url($materi->file_path) : null,
                ];
            });

        $recentQuizzes = Quiz::with(['mataPelajaran', 'kelas', 'questions'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($quiz) {
                return [
                    'id'           => $quiz->id,
                    'judul'        => $quiz->judul,
                    'mapel'        => optional($quiz->mataPelajaran)->nama_mapel,
                    'durasi'       => $quiz->durasi,
                    'status'       => $quiz->status,
                    'kelas'        => $quiz->kelas->map(function ($kelas) {
                        $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
                        return $nama !== '' ? $nama : ($kelas->kelas ?? null);
                    })->filter()->values(),
                    'pertanyaan'   => $quiz->questions->count(),
                    'created_at'   => $quiz->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Guru/Dashboard', [
            'stats' => [
                'kelas'    => $kelasCount,
                'materi'   => $materiCount,
                'kuis'     => $quizCount,
                'siswa'    => $studentCount,
            ],
            'mataPelajaran' => $guru->mataPelajaran
                ->pluck('nama_mapel')
                ->filter()
                ->unique()
                ->values(),
            'recentMateri'  => $recentMateri,
            'recentQuizzes' => $recentQuizzes,
        ]);
    }
}
