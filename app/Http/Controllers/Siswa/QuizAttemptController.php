<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizAttemptAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    public function show(Request $request, Quiz $quiz)
    {
        $user = $request->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        $quiz->load([
            'kelas',
            'mataPelajaran',
            'guru.user',
            'questions.options',
        ]);

        $kelasIds = $quiz->kelas->pluck('id');
        if ($kelasIds->isNotEmpty() && $siswa->kelas_id && !$kelasIds->contains($siswa->kelas_id)) {
            abort(403, 'Anda tidak terdaftar pada kelas kuis ini.');
        }

        $existingAttempts = $quiz->attempts()
            ->where('siswa_id', $siswa->id)
            ->count();

        if ($quiz->max_attempts !== null && $existingAttempts >= $quiz->max_attempts) {
            abort(403, 'Batas percobaan kuis telah tercapai.');
        }

        $now = now();
        if (
            ($quiz->available_from && $now->lt($quiz->available_from)) ||
            ($quiz->available_until && $now->gt($quiz->available_until))
        ) {
            abort(403, 'Kuis tidak tersedia pada waktu ini.');
        }

        if ($quiz->questions->isEmpty()) {
            abort(404, 'Kuis belum memiliki soal.');
        }

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

        $quizPayload = [
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
            'maxAttempts' => $quiz->max_attempts,
            'attemptsUsed' => $existingAttempts,
            'remainingAttempts' => $quiz->max_attempts !== null
                ? max($quiz->max_attempts - $existingAttempts, 0)
                : null,
            'questions' => $quiz->questions
                ->values()
                ->map(function ($question) {
                    $sortedOptions = $question->options->sortBy('urutan')->values();

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
                ->all(),
            'totalQuestions' => $quiz->questions->count(),
            'availableFrom' => $quiz->available_from?->toIso8601String(),
            'availableUntil' => $quiz->available_until?->toIso8601String(),
        ];

        return Inertia::render('Siswa/QuizExam', [
            'quiz' => $quizPayload,
            'backUrl' => route('siswa.quizzes'),
        ]);
    }

    public function detail(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        $user = $request->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        if ((int) $attempt->siswa_id !== (int) $siswa->id || (int) $attempt->quiz_id !== (int) $quiz->id) {
            abort(403, 'Anda tidak memiliki akses ke hasil kuis ini.');
        }

        $quiz->load([
            'kelas',
            'mataPelajaran',
            'guru.user',
            'questions.options' => fn($query) => $query->orderBy('urutan'),
        ]);

        $attempt->load([
            'answers.question.options' => fn($query) => $query->orderBy('urutan'),
        ]);

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

        $quizPayload = [
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
        ];

        $attemptPayload = [
            'id' => $attempt->id,
            'score' => $attempt->score,
            'correctAnswers' => $attempt->correct_answers,
            'totalQuestions' => $attempt->total_questions,
            'durationSeconds' => $attempt->duration_seconds,
            'submittedAt' => optional($attempt->submitted_at ?? $attempt->created_at)->toIso8601String(),
            'answers' => $attempt->answers
                ->map(fn($answer) => [
                    'questionId' => $answer->quiz_question_id,
                    'selectedOption' => $answer->selected_option,
                    'isCorrect' => $answer->is_correct,
                ])
                ->values(),
        ];

        return Inertia::render('Siswa/QuizDetail', [
            'quiz' => $quizPayload,
            'attempt' => $attemptPayload,
            'backUrl' => route('siswa.quizzes'),
            'reviewUrl' => route('siswa.quizzes.review', [$quiz, $attempt]),
        ]);
    }

    public function store(Request $request, Quiz $quiz)
    {
        $user = $request->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        $quiz->load(['questions.options', 'kelas']);

        $kelasIds = $quiz->kelas->pluck('id');
        if ($kelasIds->isNotEmpty() && $siswa->kelas_id && !$kelasIds->contains($siswa->kelas_id)) {
            abort(403, 'Anda tidak terdaftar pada kelas kuis ini.');
        }

        $existingAttempts = $quiz->attempts()
            ->where('siswa_id', $siswa->id)
            ->count();

        if ($quiz->max_attempts !== null && $existingAttempts >= $quiz->max_attempts) {
            throw ValidationException::withMessages([
                'quiz' => 'Batas percobaan kuis telah tercapai.',
            ]);
        }

        $now = now();
        if (
            ($quiz->available_from && $now->lt($quiz->available_from)) ||
            ($quiz->available_until && $now->gt($quiz->available_until))
        ) {
            abort(403, 'Kuis tidak tersedia pada waktu ini.');
        }

        if ($quiz->questions->isEmpty()) {
            throw ValidationException::withMessages([
                'quiz' => 'Kuis belum memiliki soal.',
            ]);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|integer|exists:quiz_questions,id',
            'answers.*.selected_option' => 'nullable|integer',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        $answersPayload = collect($validated['answers'])->keyBy('question_id');

        $totalQuestions = $quiz->questions->count();
        $correctAnswers = 0;

        $attempt = DB::transaction(function () use (
            $quiz,
            $siswa,
            $answersPayload,
            $totalQuestions,
            $validated,
            &$correctAnswers
        ) {
            $attempt = $quiz->attempts()->create([
                'siswa_id' => $siswa->id,
                'score' => 0,
                'correct_answers' => 0,
                'total_questions' => $totalQuestions,
                'duration_seconds' => $validated['duration_seconds'] ?? null,
                'submitted_at' => now(),
            ]);

            foreach ($quiz->questions as $question) {
                $answer = $answersPayload->get($question->id);
                $selectedOption = isset($answer['selected_option'])
                    ? (int) $answer['selected_option']
                    : null;

                $correctOption = $question->options->firstWhere('is_benar', true);
                $isCorrect = $selectedOption !== null
                    && $correctOption
                    && (int) $correctOption->urutan === $selectedOption;

                if ($isCorrect) {
                    $correctAnswers++;
                }

                $attempt->answers()->create([
                    'quiz_question_id' => $question->id,
                    'selected_option' => $selectedOption,
                    'is_correct' => $isCorrect,
                ]);
            }

            $score = $totalQuestions > 0
                ? (int) round(($correctAnswers / $totalQuestions) * 100)
                : 0;

            $attempt->update([
                'score' => $score,
                'correct_answers' => $correctAnswers,
            ]);

            return $attempt->fresh();
        });

        return response()->json([
            'message' => 'Kuis berhasil dikumpulkan.',
            'attempt' => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'correct_answers' => $attempt->correct_answers,
                'total_questions' => $attempt->total_questions,
                'submitted_at' => optional($attempt->submitted_at)->toIso8601String(),
            ],
        ]);
    }

    public function review(Request $request, Quiz $quiz, QuizAttempt $attempt)
    {
        $user = $request->user();
        $siswa = $user->siswa;

        if (!$siswa) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        if ((int) $attempt->siswa_id !== (int) $siswa->id || (int) $attempt->quiz_id !== (int) $quiz->id) {
            abort(403, 'Anda tidak memiliki akses ke pembahasan kuis ini.');
        }

        $quiz->load([
            'mataPelajaran',
            'guru.user',
            'kelas',
            'questions.options' => fn($query) => $query->orderBy('urutan'),
        ]);

        $attempt->load([
            'answers' => fn($query) => $query->orderBy('id'),
        ]);

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

        $quizPayload = [
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
                    $sortedOptions = $question->options->sortBy('urutan')->values();

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
        ];

        $attemptPayload = [
            'id' => $attempt->id,
            'score' => $attempt->score,
            'correctAnswers' => $attempt->correct_answers,
            'totalQuestions' => $attempt->total_questions,
            'durationSeconds' => $attempt->duration_seconds,
            'submittedAt' => optional($attempt->submitted_at ?? $attempt->created_at)->toIso8601String(),
            'answers' => $attempt->answers
                ->map(fn(QuizAttemptAnswer $answer) => [
                    'questionId' => $answer->quiz_question_id,
                    'selectedOption' => $answer->selected_option,
                    'isCorrect' => $answer->is_correct,
                ])
                ->values(),
        ];

        return Inertia::render('Siswa/QuizReview', [
            'quiz' => $quizPayload,
            'attempt' => $attemptPayload,
            'backUrl' => route('siswa.quizzes'),
            'detailUrl' => route('siswa.quizzes.attempts.show', [$quiz, $attempt]),
        ]);
    }
}
