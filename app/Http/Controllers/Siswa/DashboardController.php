<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $data = $this->composeStudentData();

        return Inertia::render('Siswa/Dashboard', $data);
    }

    public function materials()
    {
        $data = $this->composeStudentData();

        return Inertia::render('Siswa/Materials', Arr::only($data, [
            'student',
            'hasClass',
            'materials',
            'materialSubjects',
        ]));
    }

    public function quizzes()
    {
        $data = $this->composeStudentData();

        return Inertia::render('Siswa/Quizzes', Arr::only($data, [
            'student',
            'hasClass',
            'quizzes',
            'quizSubjects',
        ]));
    }

    public function grades()
    {
        $data = $this->composeStudentData();

        return Inertia::render('Siswa/Grades', Arr::only($data, [
            'student',
            'hasClass',
            'grades',
            'gradeSubjects',
            'gradeSummary',
        ]));
    }

    /**
     * Kumpulkan data dasar siswa yang dibutuhkan di seluruh halaman.
     */
    protected function composeStudentData(): array
    {
        $user = auth()->user();

        $siswa = $user->siswa()->with('kelas')->first();

        abort_if(!$siswa, 403, 'Profil siswa tidak ditemukan.');

        $kelas = $siswa->kelas;

        $formatKelasLabel = static function ($kelasModel) {
            if (!$kelasModel) {
                return null;
            }

            $parts = array_filter([
                $kelasModel->tingkat,
                $kelasModel->kelas,
            ]);

            $label = trim(implode(' ', $parts));

            return $label !== '' ? $label : null;
        };

        $materiQuery = Materi::with(['kelas', 'mataPelajaran', 'guru.user'])
            ->whereNotNull('guru_id');

        if ($kelas) {
            $materiQuery->where(function ($query) use ($kelas) {
                $query
                    ->where('kelas_id', $kelas->id)
                    ->orWhereNull('kelas_id');
            });
        } else {
            $materiQuery->whereNull('kelas_id');
        }

        $materiCollection = $materiQuery->latest()->get();

        $recentMaterialCount = $materiCollection
            ->filter(
                fn($materi) => $materi->created_at
                    && $materi->created_at->greaterThanOrEqualTo(now()->subDays(7))
            )
            ->count();

        $materials = $materiCollection
            ->map(function ($materi) use ($formatKelasLabel) {
                return [
                    'id' => $materi->id,
                    'title' => $materi->judul,
                    'description' => $materi->deskripsi,
                    'subject' => $materi->mataPelajaran?->nama_mapel,
                    'subjectId' => $materi->mata_pelajaran_id,
                    'className' => $formatKelasLabel($materi->kelas),
                    'teacher' => $materi->guru?->user?->name,
                    'fileName' => $materi->file_name,
                    'fileUrl' => $materi->file_path ? Storage::url($materi->file_path) : null,
                    'previewUrl' => $materi->file_path ? route('siswa.materials.preview', $materi) : null,
                    'downloadUrl' => $materi->file_path ? route('siswa.materials.download', $materi) : null,
                    'fileMime' => $materi->file_mime,
                    'fileSize' => $materi->file_size,
                    'createdAt' => $materi->created_at?->toIso8601String(),
                ];
            })
            ->values();

        $quizQuery = Quiz::with([
                'mataPelajaran',
                'guru.user',
                'kelas',
                'questions.options' => fn($query) => $query->orderBy('urutan'),
            ])
            ->where('status', 'published');

        if ($kelas) {
            $quizQuery->whereHas('kelas', function ($query) use ($kelas) {
                $query->where('kelas_id', $kelas->id);
            });
        } else {
            $quizQuery->whereRaw('1 = 0');
        }

        $quizCollection = $quizQuery->latest()->get();

        $attempts = QuizAttempt::with(['quiz.mataPelajaran'])
            ->where('siswa_id', $siswa->id)
            ->latest('submitted_at')
            ->latest('created_at')
            ->get();

        $latestAttemptPerQuiz = $attempts
            ->groupBy('quiz_id')
            ->map(fn($group) => $group->sortByDesc(fn($attempt) => $attempt->submitted_at ?? $attempt->created_at)->first());

        $now = now();

        $quizzes = $quizCollection
            ->map(function ($quiz) use ($formatKelasLabel, $latestAttemptPerQuiz, $now) {
                $latestAttempt = $latestAttemptPerQuiz->get($quiz->id);
                $isAvailable = ($quiz->available_from === null || $quiz->available_from->lte($now))
                    && ($quiz->available_until === null || $quiz->available_until->gte($now));

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->judul,
                    'description' => $quiz->deskripsi,
                    'duration' => $quiz->durasi,
                    'status' => $quiz->status,
                    'subject' => $quiz->mataPelajaran?->nama_mapel,
                    'subjectId' => $quiz->mata_pelajaran_id,
                    'teacher' => $quiz->guru?->user?->name,
                    'classNames' => $quiz->kelas
                        ->map(fn($kelasItem) => $formatKelasLabel($kelasItem))
                        ->filter()
                        ->values()
                        ->all(),
                    'questions' => $quiz->questions
                        ->map(function ($question) {
                            $sortedOptions = $question->options
                                ->sortBy('urutan')
                                ->values();

                            return [
                                'id' => $question->id,
                                'prompt' => $question->pertanyaan,
                                'options' => $sortedOptions
                                    ->map(fn($option) => [
                                        'id' => $option->id,
                                        'text' => $option->teks,
                                        'order' => $option->urutan,
                                    ])
                                    ->all(),
                                'correctAnswer' => optional(
                                    $question->options->firstWhere('is_benar', true)
                                )->urutan ?? 0,
                            ];
                        })
                        ->values()
                        ->all(),
                    'totalQuestions' => $quiz->questions->count(),
                    'createdAt' => $quiz->created_at?->toIso8601String(),
                    'availableFrom' => $quiz->available_from?->toIso8601String(),
                    'availableUntil' => $quiz->available_until?->toIso8601String(),
                    'isAvailable' => $isAvailable,
                    'latestAttempt' => $latestAttempt ? [
                        'id' => $latestAttempt->id,
                        'score' => $latestAttempt->score,
                        'correctAnswers' => $latestAttempt->correct_answers,
                        'totalQuestions' => $latestAttempt->total_questions,
                        'submittedAt' => $latestAttempt->submitted_at?->toIso8601String(),
                    ] : null,
                ];
            })
            ->values();

        $classmateCount = $kelas ? $kelas->siswa()->count() : 0;

        $stats = [
            'materialCount' => $materials->count(),
            'quizCount' => $quizzes->count(),
            'recentMaterialCount' => $recentMaterialCount,
            'classmateCount' => $classmateCount,
        ];

        $materialSubjects = $materials
            ->pluck('subject')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $quizSubjects = $quizzes
            ->pluck('subject')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $grades = $attempts
            ->map(function (QuizAttempt $attempt) {
                return [
                    'id' => $attempt->id,
                    'title' => $attempt->quiz?->judul ?? 'Kuis',
                    'subject' => $attempt->quiz?->mataPelajaran?->nama_mapel ?? 'Mata Pelajaran',
                    'type' => 'quiz',
                    'score' => $attempt->score,
                    'maxScore' => 100,
                    'date' => optional($attempt->submitted_at ?? $attempt->created_at)->toDateString(),
                    'status' => 'graded',
                    'feedback' => null,
                ];
            })
            ->values();

        $gradeSubjects = $grades
            ->pluck('subject')
            ->filter()
            ->unique()
            ->values()
            ->all();

        $overallAverage = $grades->avg(fn($grade) => $grade['score']) ?? 0;
        $quizAverage = $grades->where('type', 'quiz')->avg(fn($grade) => $grade['score']) ?? 0;
        $assignmentAverage = $grades->where('type', 'assignment')->avg(fn($grade) => $grade['score']) ?? 0;

        $gradeSummary = [
            'overallAverage' => (int) round($overallAverage),
            'quizAverage' => (int) round($quizAverage),
            'assignmentAverage' => (int) round($assignmentAverage),
            'totalAssessments' => $grades->count(),
        ];

        return [
            'student' => [
                'name' => $user->name,
                'className' => $formatKelasLabel($kelas),
            ],
            'hasClass' => (bool) $kelas,
            'stats' => $stats,
            'materials' => $materials->all(),
            'materialSubjects' => $materialSubjects,
            'quizzes' => $quizzes->all(),
            'quizSubjects' => $quizSubjects,
            'grades' => $grades->all(),
            'gradeSubjects' => $gradeSubjects,
            'gradeSummary' => $gradeSummary,
        ];
    }
}
