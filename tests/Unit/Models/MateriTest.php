<?php

/**
 * Unit Tests for Materi Model
 * 
 * Tests materi model relationships with guru, kelas, and mata pelajaran.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\Materi;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Materi Model', function () {
    
    beforeEach(function () {
        $this->guruUser = User::factory()->guru()->create();
        $this->guru = Guru::factory()->create(['user_id' => $this->guruUser->id]);
        $this->kelas = Kelas::factory()->create();
        $this->mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
    });

    describe('Relationships', function () {
        test('materi belongs to guru', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi Test',
                'deskripsi' => 'Test materi',
            ]);
            
            expect($materi->guru)->toBeInstanceOf(Guru::class);
            expect($materi->guru->id)->toBe($this->guru->id);
        });

        test('materi belongs to kelas', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi Test',
                'deskripsi' => 'Test materi',
            ]);
            
            expect($materi->kelas)->toBeInstanceOf(Kelas::class);
            expect($materi->kelas->id)->toBe($this->kelas->id);
        });

        test('materi belongs to mata pelajaran', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi Test',
                'deskripsi' => 'Test materi',
            ]);
            
            expect($materi->mataPelajaran)->toBeInstanceOf(MataPelajaran::class);
            expect($materi->mataPelajaran->id)->toBe($this->mapel->id);
        });
    });

    describe('Fillable Attributes', function () {
        test('can mass assign basic attributes', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Pengenalan Aljabar',
                'deskripsi' => 'Materi tentang dasar-dasar aljabar',
            ]);
            
            expect($materi->judul)->toBe('Pengenalan Aljabar');
            expect($materi->deskripsi)->toBe('Materi tentang dasar-dasar aljabar');
        });

        test('can mass assign file attributes', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi dengan File',
                'deskripsi' => 'Test materi',
                'file_path' => '/storage/materi/file.pdf',
                'file_name' => 'materi_aljabar.pdf',
                'file_mime' => 'application/pdf',
                'file_size' => 1024000,
            ]);
            
            expect($materi->file_path)->toBe('/storage/materi/file.pdf');
            expect($materi->file_name)->toBe('materi_aljabar.pdf');
            expect($materi->file_mime)->toBe('application/pdf');
            expect($materi->file_size)->toBe(1024000);
        });

        test('can mass assign video attributes', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi dengan Video',
                'deskripsi' => 'Test materi',
                'video_path' => '/storage/materi/video.mp4',
                'video_name' => 'tutorial_aljabar.mp4',
                'video_mime' => 'video/mp4',
                'video_size' => 50000000,
            ]);
            
            expect($materi->video_path)->toBe('/storage/materi/video.mp4');
            expect($materi->video_name)->toBe('tutorial_aljabar.mp4');
            expect($materi->video_mime)->toBe('video/mp4');
            expect($materi->video_size)->toBe(50000000);
        });

        test('can mass assign youtube url', function () {
            $materi = Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi dengan Youtube',
                'deskripsi' => 'Test materi',
                'youtube_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            ]);
            
            expect($materi->youtube_url)->toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
        });
    });

    describe('Multiple Materi Scenarios', function () {
        test('guru can have multiple materis', function () {
            Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi 1',
                'deskripsi' => 'Test materi 1',
            ]);
            
            Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi 2',
                'deskripsi' => 'Test materi 2',
            ]);
            
            expect($this->guru->materis)->toHaveCount(2);
        });

        test('kelas can have multiple materis', function () {
            Materi::create([
                'guru_id' => $this->guru->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $this->mapel->id,
                'judul' => 'Materi 1',
                'deskripsi' => 'Test materi 1',
            ]);
            
            $guru2User = User::factory()->guru()->create();
            $guru2 = Guru::factory()->create(['user_id' => $guru2User->id]);
            $mapel2 = MataPelajaran::create(['nama_mapel' => 'Fisika']);
            
            Materi::create([
                'guru_id' => $guru2->id,
                'kelas_id' => $this->kelas->id,
                'mata_pelajaran_id' => $mapel2->id,
                'judul' => 'Materi 2',
                'deskripsi' => 'Test materi 2',
            ]);
            
            expect($this->kelas->materis)->toHaveCount(2);
        });
    });
});
