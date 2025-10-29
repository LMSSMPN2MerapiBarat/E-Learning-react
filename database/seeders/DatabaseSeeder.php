<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;

class DatabaseSeeder extends Seeder
{
    /**
     * Jalankan semua seeder.
     */
    public function run(): void
    {
        // ✅ Buat admin utama
        $admin = User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // ✅ Buat 1 kelas default (untuk siswa)
        $kelas = Kelas::firstOrCreate([
            'tingkat' => 'X',
            'kelas' => 'X-A',
            'tahun_ajaran' => '2025/2026',
        ], [
            'deskripsi' => 'Kelas default untuk testing',
        ]);

        // ✅ Buat guru
        $guruUser = User::create([
            'name' => 'Guru Satu',
            'email' => 'guru@example.com',
            'password' => Hash::make('password'),
            'role' => 'guru',
        ]);

        Guru::create([
            'user_id' => $guruUser->id,
            'nip' => '123456789',
            'mapel' => 'Matematika',
            'no_telp' => '08123456789',
        ]);

        // ✅ Buat siswa
        $siswaUser = User::create([
            'name' => 'Siswa Pertama',
            'email' => 'siswa@example.com',
            'password' => Hash::make('password'),
            'role' => 'siswa',
        ]);

        Siswa::create([
            'user_id' => $siswaUser->id,
            'nis' => '987654321',
            'kelas_id' => $kelas->id,
            'no_telp' => '08987654321',
        ]);

        // ✅ (Opsional) Dummy tambahan
        // User::factory(5)->create();
    }
}
