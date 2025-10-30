<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class QuizAttemptController extends Controller
{
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
}
