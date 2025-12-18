<?php

/**
 * Unit Tests for User Model
 * 
 * Tests user model relationships, role checking methods, and attributes.
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

describe('User Model', function () {
    
    describe('Role Checking Methods', function () {
        test('isAdmin returns true for admin role', function () {
            $user = User::factory()->admin()->create();
            expect($user->isAdmin())->toBeTrue();
            expect($user->isGuru())->toBeFalse();
            expect($user->isSiswa())->toBeFalse();
        });

        test('isGuru returns true for guru role', function () {
            $user = User::factory()->guru()->create();
            expect($user->isGuru())->toBeTrue();
            expect($user->isAdmin())->toBeFalse();
            expect($user->isSiswa())->toBeFalse();
        });

        test('isSiswa returns true for siswa role', function () {
            $user = User::factory()->siswa()->create();
            expect($user->isSiswa())->toBeTrue();
            expect($user->isAdmin())->toBeFalse();
            expect($user->isGuru())->toBeFalse();
        });
    });

    describe('Relationships', function () {
        test('user has one guru relationship', function () {
            $user = User::factory()->guru()->create();
            $guru = Guru::factory()->create(['user_id' => $user->id]);
            
            expect($user->guru)->toBeInstanceOf(Guru::class);
            expect($user->guru->id)->toBe($guru->id);
        });

        test('user has one siswa relationship', function () {
            $user = User::factory()->siswa()->create();
            $kelas = Kelas::factory()->create();
            $siswa = Siswa::factory()->create([
                'user_id' => $user->id,
                'kelas_id' => $kelas->id,
            ]);
            
            expect($user->siswa)->toBeInstanceOf(Siswa::class);
            expect($user->siswa->id)->toBe($siswa->id);
        });

        test('user can have many kelas through pivot', function () {
            $user = User::factory()->siswa()->create();
            $kelas1 = Kelas::factory()->create();
            $kelas2 = Kelas::factory()->create();
            
            $user->kelas()->attach([$kelas1->id, $kelas2->id]);
            
            expect($user->kelas)->toHaveCount(2);
        });

        // Note: mataPelajaran relationship via guru_mata_pelajaran pivot
        // is tested in GuruTest since it uses guru_id, not user_id
    });

    describe('Fillable Attributes', function () {
        test('can mass assign allowed attributes', function () {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'jenis_kelamin' => 'laki-laki',
            ]);
            
            expect($user->name)->toBe('Test User');
            expect($user->email)->toBe('test@example.com');
            expect($user->role)->toBe('admin');
            expect($user->jenis_kelamin)->toBe('laki-laki');
        });

        test('password is hidden from serialization', function () {
            $user = User::factory()->create();
            $array = $user->toArray();
            
            expect($array)->not->toHaveKey('password');
        });
    });
});
