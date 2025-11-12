<?php

namespace App\Services;

use App\Models\Assignment;
use App\Models\Kelas;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class StudentNotificationService
{
    public function build(
        Siswa $siswa,
        ?Kelas $kelas,
        callable $formatClassLabel,
        ?Collection $materiCollection = null,
        ?Collection $quizCollection = null,
        ?Collection $assignmentCollection = null,
        int $windowDays = 7,
        ?Carbon $cutoff = null,
    ): array {
        $cutoff = $cutoff ? $cutoff->copy() : now()->subDays($windowDays);

        if (!$materiCollection) {
            $materiCollection = $this->fetchMateriCollection($kelas);
        }

        if (!$quizCollection) {
            $quizCollection = $this->fetchQuizCollection($kelas);
        }

        if (!$assignmentCollection) {
            $assignmentCollection = $this->fetchAssignmentCollection($kelas, $siswa);
        }

        $materialNotifications = $materiCollection
            ->filter(
                fn($materi) => $materi->created_at
                    && $materi->created_at->greaterThanOrEqualTo($cutoff),
            )
            ->map(function ($materi) use ($formatClassLabel) {
                return [
                    'id' => 'material-' . $materi->id,
                    'type' => 'material',
                    'title' => $materi->judul,
                    'meta' => array_values(array_filter([
                        $materi->mataPelajaran?->nama_mapel,
                        $materi->guru?->user?->name,
                        $formatClassLabel($materi->kelas),
                    ])),
                    'createdAt' => $materi->created_at?->toIso8601String(),
                    'url' => route('siswa.materials', ['highlight' => $materi->id]),
                    'sortTimestamp' => $materi->created_at?->getTimestamp() ?? 0,
                ];
            })
            ->values()
            ->toBase();

        $quizNotifications = $quizCollection
            ->filter(
                fn($quiz) => $quiz->created_at
                    && $quiz->created_at->greaterThanOrEqualTo($cutoff),
            )
            ->map(function ($quiz) {
                return [
                    'id' => 'quiz-' . $quiz->id,
                    'type' => 'quiz',
                    'title' => $quiz->judul,
                    'meta' => array_values(array_filter([
                        $quiz->mataPelajaran?->nama_mapel,
                        $quiz->guru?->user?->name,
                    ])),
                    'createdAt' => $quiz->created_at?->toIso8601String(),
                    'url' => route('siswa.quizzes.show', $quiz),
                    'sortTimestamp' => $quiz->created_at?->getTimestamp() ?? 0,
                ];
            })
            ->values()
            ->toBase();

        $assignmentNotifications = $assignmentCollection
            ->filter(
                fn($assignment) => $assignment->created_at
                    && $assignment->created_at->greaterThanOrEqualTo($cutoff),
            )
            ->map(function ($assignment) use ($formatClassLabel) {
                $classLabels = $assignment->kelas
                    ->map(fn($kelas) => $formatClassLabel($kelas))
                    ->filter()
                    ->values()
                    ->all();

                return [
                    'id' => 'assignment-' . $assignment->id,
                    'type' => 'assignment',
                    'title' => $assignment->judul,
                    'meta' => array_values(array_filter([
                        $assignment->mataPelajaran?->nama_mapel,
                        $assignment->guru?->user?->name,
                        $classLabels ? implode(', ', $classLabels) : null,
                    ])),
                    'createdAt' => $assignment->created_at?->toIso8601String(),
                    'url' => route('siswa.tugas.index', ['highlight' => $assignment->id]),
                    'sortTimestamp' => $assignment->created_at?->getTimestamp() ?? 0,
                ];
            })
            ->values()
            ->toBase();

        $unreadNotificationCount = $materialNotifications->count()
            + $quizNotifications->count()
            + $assignmentNotifications->count();

        $notificationItems = $materialNotifications
            ->merge($quizNotifications)
            ->merge($assignmentNotifications)
            ->sortByDesc('sortTimestamp')
            ->take(8)
            ->values()
            ->map(function ($item) {
                unset($item['sortTimestamp']);
                return $item;
            })
            ->toBase();

        $recentQuizCount = $quizCollection
            ->filter(
                fn($quiz) => $quiz->created_at
                    && $quiz->created_at->greaterThanOrEqualTo($cutoff),
            )
            ->count();

        return [
            'items' => $notificationItems->all(),
            'unreadCount' => $unreadNotificationCount,
            'recentQuizCount' => $recentQuizCount,
            'windowDays' => $windowDays,
        ];
    }

    protected function fetchMateriCollection(?Kelas $kelas): Collection
    {
        $query = Materi::with(['kelas', 'mataPelajaran', 'guru.user'])
            ->whereNotNull('guru_id');

        if ($kelas) {
            $query->where(function ($inner) use ($kelas) {
                $inner
                    ->where('kelas_id', $kelas->id)
                    ->orWhereNull('kelas_id');
            });
        } else {
            $query->whereNull('kelas_id');
        }

        return $query->latest()->get();
    }

    protected function fetchQuizCollection(?Kelas $kelas): Collection
    {
        $query = Quiz::with(['mataPelajaran', 'guru.user', 'kelas'])
            ->where('status', 'published');

        if ($kelas) {
            $query->whereHas('kelas', fn($inner) => $inner->where('kelas_id', $kelas->id));
        } else {
            $query->whereRaw('1 = 0');
        }

        return $query->latest()->get();
    }

    protected function fetchAssignmentCollection(?Kelas $kelas, Siswa $siswa): Collection
    {
        if (!$kelas) {
            return collect();
        }

        return Assignment::with([
                'kelas',
                'mataPelajaran',
                'guru.user',
                'submissions' => fn($query) => $query
                    ->where('siswa_id', $siswa->id)
                    ->latest(),
            ])
            ->where('status', '!=', 'draft')
            ->whereHas('kelas', fn($query) => $query->where('kelas.id', $kelas->id))
            ->latest('created_at')
            ->get();
    }
}
