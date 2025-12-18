<?php

/**
 * Unit Tests for Assignment Model
 * 
 * Tests assignment model relationships with guru, mata pelajaran, kelas, attachments, and submissions.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Assignment;
use App\Models\AssignmentAttachment;
use App\Models\AssignmentSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Assignment Model', function () {
    
    beforeEach(function () {
        $this->guruUser = User::factory()->guru()->create();
        $this->guru = Guru::factory()->create(['user_id' => $this->guruUser->id]);
        $this->mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
    });

    describe('Relationships', function () {
        test('assignment belongs to guru', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            expect($assignment->guru)->toBeInstanceOf(Guru::class);
            expect($assignment->guru->id)->toBe($this->guru->id);
        });

        test('assignment belongs to mata pelajaran', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            expect($assignment->mataPelajaran)->toBeInstanceOf(MataPelajaran::class);
            expect($assignment->mataPelajaran->id)->toBe($this->mapel->id);
        });

        test('assignment has many kelas through pivot', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            $kelas1 = Kelas::factory()->create();
            $kelas2 = Kelas::factory()->create();
            
            $assignment->kelas()->attach([$kelas1->id, $kelas2->id]);
            
            expect($assignment->kelas)->toHaveCount(2);
        });

        test('assignment has many attachments', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            AssignmentAttachment::create([
                'assignment_id' => $assignment->id,
                'file_path' => '/storage/assignments/file1.pdf',
                'file_name' => 'file1.pdf',
            ]);
            
            expect($assignment->attachments)->toHaveCount(1);
        });

        test('assignment has many submissions', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            $siswaUser = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $siswaUser->id,
                'kelas_id' => $kelas->id,
            ]);
            
            AssignmentSubmission::create([
                'siswa_id' => $siswa->id,
                'assignment_id' => $assignment->id,
                'text_answer' => 'Test answer',
                'submitted_at' => now(),
            ]);
            
            expect($assignment->submissions)->toHaveCount(1);
        });
    });

    describe('Attribute Casting', function () {
        test('dibuka_pada is cast to datetime', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => '2024-01-01 08:00:00',
                'ditutup_pada' => '2024-01-07 23:59:59',
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            expect($assignment->dibuka_pada)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
        });

        test('ditutup_pada is cast to datetime', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => '2024-01-01 08:00:00',
                'ditutup_pada' => '2024-01-07 23:59:59',
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'active',
            ]);
            
            expect($assignment->ditutup_pada)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
        });

        test('boolean attributes are cast correctly', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'allow_text_answer' => 1,
                'allow_file_upload' => 0,
                'allow_cancel_submit' => 1,
                'status' => 'active',
            ]);
            
            expect($assignment->allow_text_answer)->toBeBool()->toBeTrue();
            expect($assignment->allow_file_upload)->toBeBool()->toBeFalse();
            expect($assignment->allow_cancel_submit)->toBeBool()->toBeTrue();
        });

        test('allowed_file_types is cast to array', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Test',
                'deskripsi' => 'Test assignment',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'allowed_file_types' => ['pdf', 'docx', 'jpg'],
                'status' => 'active',
            ]);
            
            expect($assignment->allowed_file_types)->toBeArray();
            expect($assignment->allowed_file_types)->toContain('pdf', 'docx', 'jpg');
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $assignment = Assignment::create([
                'guru_id' => $this->guru->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Tugas Aljabar',
                'deskripsi' => 'Kerjakan soal aljabar',
                'dibuka_pada' => now(),
                'ditutup_pada' => now()->addDays(7),
                'max_score' => 100,
                'passing_grade' => 75,
                'status' => 'draft',
            ]);
            
            expect($assignment->judul)->toBe('Tugas Aljabar');
            expect($assignment->deskripsi)->toBe('Kerjakan soal aljabar');
            expect($assignment->max_score)->toBe(100);
            expect($assignment->passing_grade)->toBe(75);
            expect($assignment->status)->toBe('draft');
        });
    });
});
