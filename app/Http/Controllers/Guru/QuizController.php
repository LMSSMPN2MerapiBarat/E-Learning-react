<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AIGenerationLog;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Services\DocumentProcessorService;
use App\Services\GroqAIService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()
            ->with(['kelas', 'mataPelajaran', 'kelasMapel'])
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
                            'image'         => $question->image ? Storage::url($question->image) : null,
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

        // Build kelas-mapel options from guru_kelas_mapel table
        $kelasMapelOptions = [];
        foreach ($guru->kelasMapel as $km) {
            $kelasId = $km->kelas_id;
            if (!isset($kelasMapelOptions[$kelasId])) {
                $kelasMapelOptions[$kelasId] = [];
            }
            $kelasMapelOptions[$kelasId][] = $km->mata_pelajaran_id;
        }

        // Get AI quota information
        $userId = $user->id;
        $dailyLimit = config('services.ai_limits.daily_limit', 5);
        $remaining = AIGenerationLog::getRemainingQuota($userId, $dailyLimit);

        return Inertia::render('Guru/Kuis/KuisPage', [
            'quizzes'      => $quizzes,
            'kelasOptions' => $kelasOptions,
            'mapelOptions' => $mapelOptions,
            'kelasMapelOptions' => $kelasMapelOptions,
            'aiQuota' => [
                'used' => $dailyLimit - $remaining,
                'limit' => $dailyLimit,
                'remaining' => $remaining,
                'resets_at' => Carbon::tomorrow()->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function show(Quiz $quiz)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        abort_if($quiz->guru_id !== $guru->id, 403);

        $quiz->load(['kelas', 'mataPelajaran', 'attempts.siswa.user', 'attempts.siswa.kelas']);

        $attempts = $quiz->attempts->map(function ($attempt) {
            $siswa = $attempt->siswa;
            $user = $siswa ? $siswa->user : null;
            $kelas = $siswa ? $siswa->kelas : null;
            
            $kelasLabel = $kelas ? trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? '')) : '-';

            return [
                'id' => $attempt->id,
                'student_name' => $user ? $user->name : '-',
                'student_class' => $kelasLabel,
                'score' => $attempt->score,
                'duration_minutes' => $attempt->duration_seconds ? round($attempt->duration_seconds / 60) : 0,
                'submitted_at' => $attempt->submitted_at ? $attempt->submitted_at->format('d/m/Y H:i') : '-',
            ];
        });

        return Inertia::render('Guru/Kuis/Detail', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->judul,
                'description' => $quiz->deskripsi,
                'duration' => $quiz->durasi,
                'status' => $quiz->status,
                'mapel' => $quiz->mataPelajaran ? $quiz->mataPelajaran->nama_mapel : '-',
                'kelas' => $quiz->kelas->map(function ($k) {
                     return trim(($k->tingkat ?? '') . ' ' . ($k->kelas ?? ''));
                }),
                'attempts' => $attempts,
            ]
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
            'questions.*.image'           => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'questions.*.options'         => 'required|array|min:2|max:6',
            'questions.*.options.*'       => 'required|string',
            'questions.*.correct_answer'  => 'required|integer|min:0',
        ]);

        // Convert to integers for proper comparison (form data sends strings)
        $kelasIdsInt = array_map('intval', $validated['kelas_ids']);
        $allowedKelasInt = array_map('intval', $allowedKelas);

        foreach ($kelasIdsInt as $kelasId) {
            if (!in_array($kelasId, $allowedKelasInt, true)) {
                abort(403, 'Anda tidak memiliki akses ke salah satu kelas yang dipilih.');
            }
        }

        // Use integer array for further processing
        $validated['kelas_ids'] = $kelasIdsInt;

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
                    ? Carbon::parse($validated['available_from'], 'Asia/Jakarta')->setTimezone('UTC')
                    : null,
                'available_until'   => isset($validated['available_until'])
                    ? Carbon::parse($validated['available_until'], 'Asia/Jakarta')->setTimezone('UTC')
                    : null,
            ]);

            $quiz->kelas()->sync($validated['kelas_ids']);

            foreach ($validated['questions'] as $index => $questionData) {
                // Handle image upload
                $imagePath = null;
                if (isset($questionData['image']) && $questionData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    $imagePath = $questionData['image']->store('quiz-questions', 'public');
                }

                $question = QuizQuestion::create([
                    'quiz_id'    => $quiz->id,
                    'pertanyaan' => $questionData['question'],
                    'image'      => $imagePath,
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
            'questions.*.image'           => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
            'questions.*.existing_image'  => 'nullable|string',
            'questions.*.options'         => 'required|array|min:2|max:6',
            'questions.*.options.*'       => 'required|string',
            'questions.*.correct_answer'  => 'required|integer|min:0',
        ]);

        // Convert to integers for proper comparison (form data sends strings)
        $kelasIdsInt = array_map('intval', $validated['kelas_ids']);
        $allowedKelasInt = array_map('intval', $allowedKelas);

        foreach ($kelasIdsInt as $kelasId) {
            if (!in_array($kelasId, $allowedKelasInt, true)) {
                abort(403, 'Anda tidak memiliki akses ke salah satu kelas yang dipilih.');
            }
        }

        // Use integer array for further processing
        $validated['kelas_ids'] = $kelasIdsInt;

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
                    ? Carbon::parse($validated['available_from'], 'Asia/Jakarta')->setTimezone('UTC')
                    : null,
                'available_until'   => isset($validated['available_until'])
                    ? Carbon::parse($validated['available_until'], 'Asia/Jakarta')->setTimezone('UTC')
                    : null,
            ]);

            $quiz->kelas()->sync($validated['kelas_ids']);

            // Delete old questions and their images
            $quiz->questions()->each(function ($question) {
                if ($question->image) {
                    Storage::disk('public')->delete($question->image);
                }
                $question->options()->delete();
                $question->delete();
            });

            foreach ($validated['questions'] as $index => $questionData) {
                // Handle image upload
                $imagePath = null;
                if (isset($questionData['image']) && $questionData['image'] instanceof \Illuminate\Http\UploadedFile) {
                    $imagePath = $questionData['image']->store('quiz-questions', 'public');
                } elseif (isset($questionData['existing_image']) && !empty($questionData['existing_image'])) {
                    // Keep existing image path (strip /storage/ prefix if present)
                    $imagePath = str_replace('/storage/', '', $questionData['existing_image']);
                }

                $question = QuizQuestion::create([
                    'quiz_id'    => $quiz->id,
                    'pertanyaan' => $questionData['question'],
                    'image'      => $imagePath,
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

    /**
     * Generate quiz questions from uploaded document using AI
     */
    public function generateQuizFromDocument(Request $request)
    {
        $validated = $request->validate([
            'document' => 'required|file|mimes:doc,docx,pdf|max:10240', // Max 10MB
            'number_of_questions' => 'required|integer|min:1|max:50',
        ]);

        $userId = auth()->id();
        $dailyLimit = config('services.ai_limits.daily_limit', 50);
        
        // Check daily limit BEFORE processing
        if (AIGenerationLog::hasReachedLimit($userId, $dailyLimit)) {
            return response()->json([
                'success' => false,
                'message' => 'Batas harian AI generation tercapai. Coba lagi besok.',
                'quota' => [
                    'used' => $dailyLimit,
                    'limit' => $dailyLimit,
                    'remaining' => 0,
                    'resets_at' => Carbon::tomorrow()->format('Y-m-d H:i:s')
                ]
            ], 429);
        }

        try {
            $file = $request->file('document');
            $numberOfQuestions = (int) $validated['number_of_questions'];

            // Extract text from document
            $documentProcessor = new DocumentProcessorService();
            $extracted = $documentProcessor->extractText($file);
            
            $materialText = $extracted['text'];
            $detectedLanguage = $extracted['language'];

            // Generate quiz using AI
            $groqService = new GroqAIService();
            $quizData = $groqService->generateQuiz($materialText, $detectedLanguage, $numberOfQuestions);

            // Convert AI format to frontend format
            $questions = [];
            foreach ($quizData['kuis'] as $item) {
                // Map A,B,C,D to indices 0,1,2,3
                $correctAnswerMap = ['A' => 0, 'B' => 1, 'C' => 2, 'D' => 3];
                
                $questions[] = [
                    'id' => uniqid('ai_'), // Temporary ID for frontend
                    'question' => $item['pertanyaan'],
                    'options' => [
                        $item['pilihan']['A'],
                        $item['pilihan']['B'],
                        $item['pilihan']['C'],
                        $item['pilihan']['D'],
                    ],
                    'correct_answer' => $correctAnswerMap[$item['jawaban_benar']] ?? 0,
                ];
            }

            // Log successful generation
            AIGenerationLog::create([
                'user_id' => $userId,
                'type' => 'quiz_generation',
                'questions_count' => $numberOfQuestions,
                'model_used' => config('services.groq.model'),
                'success' => true,
            ]);

            // Get updated quota
            $remaining = AIGenerationLog::getRemainingQuota($userId, $dailyLimit);

            return response()->json([
                'success' => true,
                'data' => [
                    'language' => $quizData['bahasa'],
                    'questions' => $questions,
                    'message' => 'Quiz successfully generated from document'
                ],
                'quota' => [
                    'used' => $dailyLimit - $remaining,
                    'limit' => $dailyLimit,
                    'remaining' => $remaining,
                    'resets_at' => Carbon::tomorrow()->format('Y-m-d H:i:s')
                ]
            ]);

        } catch (\Exception $e) {
            // Log failed attempt
            AIGenerationLog::create([
                'user_id' => $userId,
                'type' => 'quiz_generation',
                'questions_count' => $validated['number_of_questions'],
                'model_used' => config('services.groq.model'),
                'success' => false,
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}

