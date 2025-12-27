<?php

/**
 * Unit Tests for Guru Model
 * 
 * Tests guru model relationships with user, mata pelajaran, kelas, materis, quizzes, and assignments.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Materi;
use App\Models\Quiz;
use App\Models\Assignment;
use App\Models\GuruKelasMapel;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Guru Model', function () {
    
    describe('Relationships', function () {
        test('guru belongs to user', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            
            expect($guru->user)->toBeInstanceOf(User::class);
            expect($guru->user->id)->toBe($user->id);
        });

        test('guru has many mata pelajaran through pivot', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $mapel1 = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            $mapel2 = MataPelajaran::create(['nama_mapel' => 'Fisika']);
            
            $guru->mataPelajaran()->attach([$mapel1->id, $mapel2->id]);
            
            expect($guru->mataPelajaran)->toHaveCount(2);
            expect($guru->mataPelajaran->pluck('nama_mapel')->toArray())
                ->toContain('Matematika', 'Fisika');
        });

        test('guru has many materis', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $kelas = Kelas::factory()->create();
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            Materi::create([
                'guru_id' => $guru->id,
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Materi 1',
                'deskripsi' => 'Deskripsi materi 1',
            ]);
            
            expect($guru->materis)->toHaveCount(1);
        });

        test('guru has many quizzes', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            Quiz::create([
                'guru_id' => $guru->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Quiz 1',
                'deskripsi' => 'Deskripsi quiz 1',
                'durasi' => 60,
                'max_attempts' => 3,
                'status' => 'published',
            ]);
            
            expect($guru->quizzes)->toHaveCount(1);
        });

        test('guru has many assignments', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            Assignment::create([
                'guru_id' => $guru->id,
                'mata_pelajaran_id' => $mapel->id,
                'judul' => 'Tugas 1',
                'deskripsi' => 'Deskripsi tugas 1',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'published',
            ]);
            
            expect($guru->assignments)->toHaveCount(1);
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $user = User::factory()->guru()->create();
            
            $guru = Guru::create([
                'user_id' => $user->id,
                'nip' => '123456789012345678',
                'mapel' => 'Matematika',
                'no_telp' => '081234567890',
            ]);
            
            expect($guru->nip)->toBe('123456789012345678');
            expect($guru->mapel)->toBe('Matematika');
            expect($guru->no_telp)->toBe('081234567890');
        });
    });

    describe('Kelas Mapel Methods', function () {
        test('guru can sync kelas mapel assignments', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $kelas = Kelas::factory()->create();
            $mapel1 = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            $mapel2 = MataPelajaran::create(['nama_mapel' => 'Fisika']);
            
            $guru->syncKelasMapel([
                $kelas->id => [$mapel1->id, $mapel2->id],
            ]);
            
            expect($guru->kelasMapel)->toHaveCount(2);
        });

        test('guru can get mapel di kelas', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            $kelas = Kelas::factory()->create();
            $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
            
            GuruKelasMapel::create([
                'guru_id' => $guru->id,
                'kelas_id' => $kelas->id,
                'mata_pelajaran_id' => $mapel->id,
            ]);
            
            $mapelIds = $guru->mapelDiKelas($kelas->id);
            
            expect($mapelIds)->toContain($mapel->id);
        });
    });
});
