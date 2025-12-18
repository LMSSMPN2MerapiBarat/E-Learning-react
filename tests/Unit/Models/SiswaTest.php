<?php

/**
 * Unit Tests for Siswa Model
 * 
 * Tests siswa model relationships with user, kelas, quiz attempts, and assignment submissions.
 */

use App\Models\User;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\Guru;
use App\Models\MataPelajaran;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Siswa Model', function () {
    
    describe('Relationships', function () {
        test('siswa belongs to user', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
            ]);
            
            expect($siswa->user)->toBeInstanceOf(User::class);
            expect($siswa->user->id)->toBe($user->id);
        });

        test('siswa belongs to kelas', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
            ]);
            
            expect($siswa->kelas)->toBeInstanceOf(Kelas::class);
            expect($siswa->kelas->id)->toBe($kelas->id);
        });

        test('siswa has many quiz attempts', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
            ]);
            
            $guruUser = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $guruUser->id]);
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            $quiz = Quiz::create([
                'guru_id' => $guru->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Quiz Test',
                'deskripsi' => 'Test quiz',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            QuizAttempt::create([
                'siswa_id' => $siswa->id,
                'quiz_id' => $quiz->id,
                'started_at' => now(),
                'score' => 80,
                'correct_answers' => 8,
                'total_questions' => 10,
            ]);
            
            expect($siswa->quizAttempts)->toHaveCount(1);
        });

        test('siswa has many assignment submissions', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
            ]);
            
            $guruUser = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $guruUser->id]);
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            $assignment = Assignment::create([
                'guru_id' => $guru->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'published',
            ]);
            
            AssignmentSubmission::create([
                'siswa_id' => $siswa->id,
                'assignment_id' => $assignment->id,
                'text_answer' => 'Test answer',
                'submitted_at' => now(),
            ]);
            
            expect($siswa->assignmentSubmissions)->toHaveCount(1);
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            
            $siswa = Siswa::create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
                'nis' => '1234567890',
                'no_telp' => '081234567890',
                'tempat_lahir' => 'Jakarta',
                'tanggal_lahir' => '2010-01-01',
            ]);
            
            expect($siswa->nis)->toBe('1234567890');
            expect($siswa->no_telp)->toBe('081234567890');
            expect($siswa->tempat_lahir)->toBe('Jakarta');
        });
    });
});
