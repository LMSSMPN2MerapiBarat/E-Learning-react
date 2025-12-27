<?php

/**
 * Unit Tests for Kelas Model
 * 
 * Tests kelas model relationships with siswa, guru, materis, quizzes, and assignments.
 */

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\Assignment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Kelas Model', function () {
    
    describe('Relationships', function () {
        test('kelas has many siswa', function () {
            $kelas = Kelas::factory()->create();
            
            $user1 = User::factory()->siswa()->create();
            $user2 = User::factory()->siswa()->create();
            
            Siswa::factory()->create(['user_id' => $user1->id, 'kelas_id' => $kelas->id]);
            Siswa::factory()->create(['user_id' => $user2->id, 'kelas_id' => $kelas->id]);
            
            expect($kelas->siswa)->toHaveCount(2);
        });

        test('kelas has many guru through pivot', function () {
            $kelas = Kelas::factory()->create();
            
            $user1 = User::factory()->guru()->create();
            $user2 = User::factory()->guru()->create();
            
            $kelas->guru()->attach([$user1->id, $user2->id]);
            
            expect($kelas->guru)->toHaveCount(2);
        });

        test('kelas has many materis', function () {
            $kelas = Kelas::factory()->create();
            $guruUser = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $guruUser->id]);
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            Materi::create([
                'guru_id' => $guru->id,
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Materi Test',
                'deskripsi' => 'Test materi',
            ]);
            
            expect($kelas->materis)->toHaveCount(1);
        });

        test('kelas has many quizzes through pivot', function () {
            $kelas = Kelas::factory()->create();
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
            
            $kelas->quizzes()->attach($quiz->id);
            
            expect($kelas->quizzes)->toHaveCount(1);
        });

        test('kelas has many assignments through pivot', function () {
            $kelas = Kelas::factory()->create();
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
            
            $kelas->assignments()->attach($assignment->id);
            
            expect($kelas->assignments)->toHaveCount(1);
        });
    });

    describe('Computed Attributes', function () {
        test('jumlah siswa attribute returns correct count', function () {
            $kelas = Kelas::factory()->create();
            
            $user1 = User::factory()->siswa()->create();
            $user2 = User::factory()->siswa()->create();
            $user3 = User::factory()->siswa()->create();
            
            Siswa::factory()->create(['user_id' => $user1->id, 'kelas_id' => $kelas->id]);
            Siswa::factory()->create(['user_id' => $user2->id, 'kelas_id' => $kelas->id]);
            Siswa::factory()->create(['user_id' => $user3->id, 'kelas_id' => $kelas->id]);
            
            expect($kelas->jumlah_siswa)->toBe(3);
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $kelas = Kelas::create([
                'tingkat' => 'VII',
                'kelas' => 'A',
                'tahun_ajaran' => '2024/2025',
                'deskripsi' => 'Kelas VII-A',
            ]);
            
            expect($kelas->tingkat)->toBe('VII');
            expect($kelas->kelas)->toBe('A');
            expect($kelas->tahun_ajaran)->toBe('2024/2025');
            expect($kelas->deskripsi)->toBe('Kelas VII-A');
        });
    });
});
