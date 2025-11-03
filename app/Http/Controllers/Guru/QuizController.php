<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()
            ->with(['kelas', 'mataPelajaran'])
            ->firstOrFail();

        $quizzes = Quiz::with([
                'mataPelajaran',
                'kelas',
                'questions.options',
            ])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($quiz) {
                return [
                    'id'          => $quiz->id,
                    'judul'       => $quiz->judul,
                    'deskripsi'   => $quiz->deskripsi,
                    'durasi'      => $quiz->durasi,
                    'max_attempts'=> $quiz->max_attempts,
                    'status'      => $quiz->status,
                    'mata_pelajaran_id' => $quiz->mata_pelajaran_id,
                    'mapel'       => $quiz->mataPelajaran ? [
                        'id'   => $quiz->mata_pelajaran_id,
                        'nama' => $quiz->mataPelajaran->nama_mapel,
                    ] : null,
                    'available_from' => $quiz->available_from?->toIso8601String(),
                    'available_until' => $quiz->available_until?->toIso8601String(),
                    'kelas'       => $quiz->kelas->map(function ($kelas) {
                        $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
                        return [
                            'id'   => $kelas->id,
                            'nama' => $nama !== '' ? $nama : ($kelas->kelas ?? null),
                        ];
                    })->filter(fn($item) => !empty($item['nama']))->values(),
                    'kelas_ids'   => $quiz->kelas->pluck('id')->values(),
                    'questions'   => $quiz->questions->map(function ($question) {
                        return [
                            'id'            => $question->id,
                            'question'      => $question->pertanyaan,
                            'options'       => $question->options
                                ->sortBy('urutan')
                                ->map(fn($opt) => $opt->teks)
                                ->values(),
                            'correct_answer' => optional(
                                $question->options->firstWhere('is_benar', true)
                            )->urutan ?? 0,
                        ];
                    })->values(),
                    'created_at'  => $quiz->created_at?->toIso8601String(),
                ];
            });

        $kelasOptions = $guru->kelas->map(function ($kelas) {
            $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
            return [
                'id'   => $kelas->id,
                'nama' => $nama !== '' ? $nama : ($kelas->kelas ?? null),
            ];
        })->filter(fn($item) => !empty($item['nama']))->values();

        $mapelOptions = $guru->mataPelajaran->map(function ($mapel) {
            return [
                'id'   => $mapel->id,
                'nama' => $mapel->nama_mapel,
            ];
        })->filter(fn($item) => !empty($item['nama']))->values();

        return Inertia::render('Guru/Kuis/KuisPage', [
            'quizzes'      => $quizzes,
            'kelasOptions' => $kelasOptions,
            'mapelOptions' => $mapelOptions,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();
        $allowedKelas = $guru->kelas->pluck('id')->all();

        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'mata_pelajaran_id'  => 'required|exists:mata_pelajarans,id',
            'duration'           => 'required|integer|min:1|max:600',
            'max_attempts'       => 'required|in:unlimited,1,2',
            'status'             => 'required|in:draft,published',
            'available_from'     => 'nullable|date',
            'available_until'    => 'nullable|date|after:available_from',
            'kelas_ids'          => 'required|array|min:1',
            'kelas_ids.*'        => 'exists:kelas,id',
            'questions'          => 'required|array|min:1',
            'questions.*.question'        => 'required|string',
            'questions.*.options'         => 'required|array|min:2|max:6',
            'questions.*.options.*'       => 'required|string',
            'questions.*.correct_answer'  => 'required|integer|min:0',
        ]);

        foreach ($validated['kelas_ids'] as $kelasId) {
            if (!in_array($kelasId, $allowedKelas, true)) {
                abort(403, 'Anda tidak memiliki akses ke salah satu kelas yang dipilih.');
            }
        }

        $maxAttemptsInput = $validated['max_attempts'];
        $maxAttempts = $maxAttemptsInput === 'unlimited' ? null : (int) $maxAttemptsInput;

        DB::transaction(function () use ($validated, $guru, $maxAttempts) {
            $quiz = Quiz::create([
                'guru_id'           => $guru->id,
                'mata_pelajaran_id' => (int) $validated['mata_pelajaran_id'],
                'judul'             => $validated['title'],
                'deskripsi'         => $validated['description'] ?? null,
                'durasi'            => $validated['duration'],
                'max_attempts'      => $maxAttempts,
                'status'            => $validated['status'],
                'available_from'    => isset($validated['available_from'])
                    ? Carbon::parse($validated['available_from'])
                    : null,
                'available_until'   => isset($validated['available_until'])
                    ? Carbon::parse($validated['available_until'])
                    : null,
            ]);

            $quiz->kelas()->sync($validated['kelas_ids']);

            foreach ($validated['questions'] as $index => $questionData) {
                $question = QuizQuestion::create([
                    'quiz_id'    => $quiz->id,
                    'pertanyaan' => $questionData['question'],
                    'urutan'     => $index,
                ]);

                foreach ($questionData['options'] as $optionIndex => $optionText) {
                    QuizOption::create([
                        'quiz_question_id' => $question->id,
                        'teks'             => $optionText,
                        'is_benar'         => $optionIndex === (int) $questionData['correct_answer'],
                        'urutan'           => $optionIndex,
                    ]);
                }
            }
        });

        return back()->with('success', 'Kuis berhasil dibuat.');
    }

    public function update(Request $request, Quiz $quiz)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();

        abort_if($quiz->guru_id !== $guru->id, 403);

        $allowedKelas = $guru->kelas->pluck('id')->all();

        $validated = $request->validate([
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'mata_pelajaran_id'  => 'required|exists:mata_pelajarans,id',
            'duration'           => 'required|integer|min:1|max:600',
            'max_attempts'       => 'required|in:unlimited,1,2',
            'status'             => 'required|in:draft,published',
            'available_from'     => 'nullable|date',
            'available_until'    => 'nullable|date|after:available_from',
            'kelas_ids'          => 'required|array|min:1',
            'kelas_ids.*'        => 'exists:kelas,id',
            'questions'          => 'required|array|min:1',
            'questions.*.question'        => 'required|string',
            'questions.*.options'         => 'required|array|min:2|max:6',
            'questions.*.options.*'       => 'required|string',
            'questions.*.correct_answer'  => 'required|integer|min:0',
        ]);

        foreach ($validated['kelas_ids'] as $kelasId) {
            if (!in_array($kelasId, $allowedKelas, true)) {
                abort(403, 'Anda tidak memiliki akses ke salah satu kelas yang dipilih.');
            }
        }

        $maxAttemptsInput = $validated['max_attempts'];
        $maxAttempts = $maxAttemptsInput === 'unlimited' ? null : (int) $maxAttemptsInput;

        DB::transaction(function () use ($quiz, $validated, $maxAttempts) {
            $quiz->update([
                'mata_pelajaran_id' => (int) $validated['mata_pelajaran_id'],
                'judul'             => $validated['title'],
                'deskripsi'         => $validated['description'] ?? null,
                'durasi'            => $validated['duration'],
                'max_attempts'      => $maxAttempts,
                'status'            => $validated['status'],
                'available_from'    => isset($validated['available_from'])
                    ? Carbon::parse($validated['available_from'])
                    : null,
                'available_until'   => isset($validated['available_until'])
                    ? Carbon::parse($validated['available_until'])
                    : null,
            ]);

            $quiz->kelas()->sync($validated['kelas_ids']);

            $quiz->questions()->each(function ($question) {
                $question->options()->delete();
                $question->delete();
            });

            foreach ($validated['questions'] as $index => $questionData) {
                $question = QuizQuestion::create([
                    'quiz_id'    => $quiz->id,
                    'pertanyaan' => $questionData['question'],
                    'urutan'     => $index,
                ]);

                foreach ($questionData['options'] as $optionIndex => $optionText) {
                    QuizOption::create([
                        'quiz_question_id' => $question->id,
                        'teks'             => $optionText,
                        'is_benar'         => $optionIndex === (int) $questionData['correct_answer'],
                        'urutan'           => $optionIndex,
                    ]);
                }
            }
        });

        return back()->with('success', 'Kuis berhasil diperbarui.');
    }

    public function destroy(Quiz $quiz)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        abort_if($quiz->guru_id !== $guru->id, 403);

        $quiz->delete();

        return back()->with('success', 'Kuis berhasil dihapus.');
    }
}
