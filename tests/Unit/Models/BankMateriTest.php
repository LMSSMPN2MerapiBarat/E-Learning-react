<?php

/**
 * Unit Test untuk Model Bank Materi
 * 
 * Menguji relasi model bank materi dengan guru dan atribut-atributnya.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\BankMateri;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('Model Bank Materi', function () {
    
    beforeEach(function () {
        $this->guruUser = User::factory()->guru()->create();
        $this->guru = Guru::factory()->create(['user_id' => $this->guruUser->id]);
    });

    describe('Relasi', function () {
        test('bank materi memiliki relasi ke guru', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Matematika Dasar',
                'deskripsi' => 'Kumpulan materi matematika dasar',
                'file_path' => '/storage/bank-materi/file.pdf',
                'file_name' => 'materi_matematika.pdf',
                'file_mime' => 'application/pdf',
                'file_size' => 1024000,
                'status' => 'published',
            ]);
            
            expect($bankMateri->guru)->toBeInstanceOf(Guru::class);
            expect($bankMateri->guru->id)->toBe($this->guru->id);
        });
    });

    describe('Atribut Fillable', function () {
        test('dapat mass assign atribut dasar', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Aljabar',
                'deskripsi' => 'Pengenalan aljabar untuk SMP',
                'status' => 'published',
            ]);
            
            expect($bankMateri->nama)->toBe('Materi Aljabar');
            expect($bankMateri->deskripsi)->toBe('Pengenalan aljabar untuk SMP');
            expect($bankMateri->status)->toBe('published');
        });

        test('dapat mass assign atribut file', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi dengan File',
                'file_path' => '/storage/bank-materi/1/dokumen.pdf',
                'file_name' => 'dokumen_lengkap.pdf',
                'file_mime' => 'application/pdf',
                'file_size' => 2048000,
                'status' => 'draft',
            ]);
            
            expect($bankMateri->file_path)->toBe('/storage/bank-materi/1/dokumen.pdf');
            expect($bankMateri->file_name)->toBe('dokumen_lengkap.pdf');
            expect($bankMateri->file_mime)->toBe('application/pdf');
            expect($bankMateri->file_size)->toBe(2048000);
        });
    });

    describe('Konversi Atribut', function () {
        test('file_size dikonversi ke integer', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Test Materi',
                'file_size' => '1024000',
                'status' => 'published',
            ]);
            
            expect($bankMateri->file_size)->toBeInt();
            expect($bankMateri->file_size)->toBe(1024000);
        });
    });

    describe('Skenario Multiple Bank Materi', function () {
        test('guru dapat memiliki banyak bank materi', function () {
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi 1',
                'status' => 'published',
            ]);
            
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi 2',
                'status' => 'draft',
            ]);
            
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi 3',
                'status' => 'published',
            ]);
            
            $bankMateris = BankMateri::where('guru_id', $this->guru->id)->get();
            expect($bankMateris)->toHaveCount(3);
        });

        test('bank materi dapat difilter berdasarkan status', function () {
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Published 1',
                'status' => 'published',
            ]);
            
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Draft 1',
                'status' => 'draft',
            ]);
            
            BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Published 2',
                'status' => 'published',
            ]);
            
            $publishedMateris = BankMateri::where('guru_id', $this->guru->id)
                ->where('status', 'published')
                ->get();
            
            $draftMateris = BankMateri::where('guru_id', $this->guru->id)
                ->where('status', 'draft')
                ->get();
            
            expect($publishedMateris)->toHaveCount(2);
            expect($draftMateris)->toHaveCount(1);
        });
    });

    describe('Status Bank Materi', function () {
        test('bank materi dapat disimpan dengan status published', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Published',
                'status' => 'published',
            ]);
            
            expect($bankMateri->status)->toBe('published');
        });

        test('bank materi dapat disimpan dengan status draft', function () {
            $bankMateri = BankMateri::create([
                'guru_id' => $this->guru->id,
                'nama' => 'Materi Draft',
                'status' => 'draft',
            ]);
            
            expect($bankMateri->status)->toBe('draft');
        });
    });
});
