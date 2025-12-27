<?php

/**
 * Unit Tests for Quiz Model
 * 
 * Tests quiz model relationships with guru, mata pelajaran, kelas, questions, and attempts.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use App\Models\Siswa;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Quiz Model', function () {
    
    beforeEach(function () {
        $this->guruUser = User::factory()->guru()->create();
        $this->guru = Guru::factory()->create(['user_id' => $this->guruUser->id]);
        $this->mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
    });

    describe('Relationships', function () {
        test('quiz belongs to guru', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            expect($quiz->guru)->toBeInstanceOf(Guru::class);
            expect($quiz->guru->id)->toBe($this->guru->id);
        });

        test('quiz belongs to mata pelajaran', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            expect($quiz->mataPelajaran)->toBeInstanceOf(MataPelajaran::class);
            expect($quiz->mataPelajaran->id)->toBe($this->mapel->id);
        });

        test('quiz has many kelas through pivot', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            $kelas1 = Kelas::factory()->create();
            $kelas2 = Kelas::factory()->create();
            
            $quiz->kelas()->attach([$kelas1->id, $kelas2->id]);
            
            expect($quiz->kelas)->toHaveCount(2);
        });

        test('quiz has many questions', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'pertanyaan' => 'Berapa 1+1?',
            ]);
            
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'pertanyaan' => 'Berapa 2+2?',
            ]);
            
            expect($quiz->questions)->toHaveCount(2);
        });

        test('quiz has many attempts', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            $siswaUser = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $siswaUser->id,
                'kelas_id' => $kelas->id,
            ]);
            
            QuizAttempt::create([
                'siswa_id' => $siswa->id,
                'quiz_id' => $quiz->id,
                'started_at' => now(),
                'score' => 80,
                'correct_answers' => 8,
                'total_questions' => 10,
            ]);
            
            expect($quiz->attempts)->toHaveCount(1);
        });
    });

    describe('Attribute Casting', function () {
        test('durasi is cast to integer', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => '60',
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            expect($quiz->durasi)->toBeInt();
            expect($quiz->durasi)->toBe(60);
        });

        test('max_attempts is cast to integer', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => '3',
                'status' => 'published',
            ]);
            
            expect($quiz->max_attempts)->toBeInt();
            expect($quiz->max_attempts)->toBe(3);
        });

        test('available_from and available_until are cast to datetime', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
                'available_from' => '2024-01-01 08:00:00',
                'available_until' => '2024-01-31 23:59:59',
            ]);
            
            expect($quiz->available_from)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
            expect($quiz->available_until)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $quiz = Quiz::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Quiz Matematika',
                'deskripsi' => 'Quiz tentang aljabar',
                'durasi' => 45,
                'max_attempts' => 2,
                'status' => 'draft',
            ]);
            
            expect($quiz->judul)->toBe('Quiz Matematika');
            expect($quiz->deskripsi)->toBe('Quiz tentang aljabar');
            expect($quiz->durasi)->toBe(45);
            expect($quiz->max_attempts)->toBe(2);
            expect($quiz->status)->toBe('draft');
        });
    });
});
