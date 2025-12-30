<?php

/**
 * Smoke Tests for E-Learning Application
 * 
 * This file contains comprehensive smoke tests that verify all major features
 * and routes in the application are accessible and functioning correctly.
 * 
 * Test Coverage:
 * - Public Routes (landing page, login)
 * - Admin Routes (dashboard, siswa, guru, kelas, mapel, jadwal, users)
 * - Admin CRUD Operations (store guru, kelas, mapel, jadwal)
 * - Guru Routes (dashboard, materi, kelas, kuis, tugas)
 * - Guru CRUD Operations (store materi, kuis, tugas)
 * - Siswa Routes (dashboard, materi, kuis, jadwal, nilai, mata-pelajaran, tugas)
 * - Profile Routes (all roles)
 * - Authorization (role-based access control)
 * - Authentication (login, logout)
 * 
 * Run tests with: php vendor/bin/pest tests/Feature/SmokeTest.php
 * 
 * @see phpunit.xml for test database configuration
 */

use App\Models\User;
use App\Models\Guru;
use App\Models\Siswa;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/*
|--------------------------------------------------------------------------
| Helper Functions  
|--------------------------------------------------------------------------
*/

function createAdminUser(): User
{
    return User::factory()->admin()->create();
}

function createGuruUser(): array
{
    $user = User::factory()->guru()->create();
    $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
    $kelas = Kelas::create([
        'tingkat' => 'X',
        'kelas' => 'A',
        'tahun_ajaran' => '2024/2025',
        'deskripsi' => 'Kelas X-A',
    ]);
    $guru = Guru::create([
        'user_id' => $user->id,
        'nip' => fake()->numerify('##################'),
        'mapel' => 'Matematika',
        'no_telp' => fake()->numerify('08##########'),
    ]);
    $guru->mataPelajaran()->attach($mapel->id);
    
    // Attach kelas to guru via guru_kelas pivot table (using user_id)
    \DB::table('guru_kelas')->insert([
        'user_id' => $user->id,
        'kelas_id' => $kelas->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
    
    return ['user' => $user, 'guru' => $guru, 'mapel' => $mapel, 'kelas' => $kelas];
}

function createSiswaUser(): array
{
    $kelas = Kelas::firstOrCreate([
        'tingkat' => 'X',
        'kelas' => 'A',
    ], [
        'tahun_ajaran' => '2024/2025',
        'deskripsi' => 'Kelas X-A',
    ]);
    
    $user = User::factory()->siswa()->create();
    $siswa = Siswa::create([
        'user_id' => $user->id,
        'kelas_id' => $kelas->id,
        'nis' => fake()->numerify('##########'),
        'no_telp' => fake()->numerify('08##########'),
    ]);
    
    return ['user' => $user, 'siswa' => $siswa, 'kelas' => $kelas];
}

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Public Routes', function () {
    test('landing page returns successful response', function () {
        $this->get('/')->assertStatus(200);
    });

    test('login page returns successful response', function () {
        $this->get('/login')->assertStatus(200);
    });
});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Admin Routes', function () {
    test('admin dashboard returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/dashboard')->assertStatus(200);
    });

    test('admin siswa page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/siswa/Siswa')->assertStatus(200);
    });

    test('admin guru page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/guru/Guru')->assertStatus(200);
    });

    test('admin kelas page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/kelas/Kelas')->assertStatus(200);
    });

    test('admin create kelas page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/kelas/Create')->assertStatus(200);
    });

    test('admin mapel page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/mapel/Mapel')->assertStatus(200);
    });

    test('admin create mapel page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/mapel/Create')->assertStatus(200);
    });

    test('admin jadwal kelas page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/jadwal-kelas/Jadwal')->assertStatus(200);
    });

    test('admin create jadwal kelas page returns successful response', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/admin/jadwal-kelas/Create')->assertStatus(200);
    });

});

/*
|--------------------------------------------------------------------------
| ADMIN CRUD OPERATIONS SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Admin CRUD Operations', function () {
    test('admin can store guru', function () {
        $admin = createAdminUser();
        $mapel = MataPelajaran::create(['nama_mapel' => 'Matematika']);
        
        $this->actingAs($admin)->post('/admin/guru', [
            'name' => 'Guru Test',
            'email' => 'guru.test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'nip' => '123456789012345678',
            'no_telp' => '081234567890',
            'jenis_kelamin' => 'laki-laki',
            'mapel_ids' => [$mapel->id],
        ])->assertRedirect();
    });

    test('admin can store kelas', function () {
        $admin = createAdminUser();
        
        $this->actingAs($admin)->post('/admin/kelas', [
            'tingkat' => 'X',
            'kelas' => 'B',
            'tahun_ajaran' => '2024/2025',
            'deskripsi' => 'Kelas X-B',
        ])->assertRedirect();
    });

    test('admin can store mapel', function () {
        $admin = createAdminUser();
        
        $this->actingAs($admin)->post('/admin/mapel', [
            'nama_mapel' => 'Bahasa Indonesia',
        ])->assertRedirect();
    });

    test('admin can store jadwal kelas', function () {
        $admin = createAdminUser();
        $guruData = createGuruUser();
        $kelas = Kelas::create([
            'tingkat' => 'X',
            'kelas' => 'C',
            'tahun_ajaran' => '2024/2025',
            'deskripsi' => 'Kelas X-C',
        ]);
        
        $this->actingAs($admin)->post('/admin/jadwal-kelas', [
            'guru_id' => $guruData['guru']->id,
            'mata_pelajaran_id' => $guruData['mapel']->id,
            'kelas_id' => $kelas->id,
            'day' => 'Senin',
            'start_time' => '08:00',
            'end_time' => '09:30',
            'room' => 'Ruang 101',
        ])->assertRedirect();
    });
});

/*
|--------------------------------------------------------------------------
| GURU ROUTES SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Guru Routes', function () {
    test('guru dashboard returns successful response', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/guru/dashboard')->assertStatus(200);
    });

    test('guru materi page returns successful response', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/guru/materi')->assertStatus(200);
    });

    test('guru kelas page returns successful response', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/guru/kelas')->assertStatus(200);
    });

    test('guru kuis page returns successful response', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/guru/kuis')->assertStatus(200);
    });

    test('guru tugas page returns successful response', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/guru/tugas')->assertStatus(200);
    });

});

describe('Operasi CRUD Bank Materi', function () {
    test('guru dapat menyimpan bank materi dengan file', function () {
        $guruData = createGuruUser();
        
        $file = \Illuminate\Http\UploadedFile::fake()->create('materi.pdf', 1024, 'application/pdf');
        
        $this->actingAs($guruData['user'])->post('/guru/bank-materi', [
            'nama' => 'Materi Test Bank Materi',
            'deskripsi' => 'Deskripsi test bank materi',
            'status' => 'published',
            'file' => $file,
        ])->assertRedirect();
    });

    test('guru dapat mengupdate bank materi', function () {
        $guruData = createGuruUser();
        
        // Buat bank materi terlebih dahulu
        $bankMateri = \App\Models\BankMateri::create([
            'guru_id' => $guruData['guru']->id,
            'nama' => 'Materi Lama',
            'deskripsi' => 'Deskripsi lama',
            'status' => 'draft',
        ]);
        
        $this->actingAs($guruData['user'])->put("/guru/bank-materi/{$bankMateri->id}", [
            'nama' => 'Materi Baru',
            'deskripsi' => 'Deskripsi baru',
            'status' => 'published',
        ])->assertRedirect();
    });

    test('guru dapat menghapus bank materi', function () {
        $guruData = createGuruUser();
        
        // Buat bank materi terlebih dahulu
        $bankMateri = \App\Models\BankMateri::create([
            'guru_id' => $guruData['guru']->id,
            'nama' => 'Materi Akan Dihapus',
            'status' => 'draft',
        ]);
        
        $this->actingAs($guruData['user'])
            ->delete("/guru/bank-materi/{$bankMateri->id}")
            ->assertRedirect();
        
        $this->assertDatabaseMissing('bank_materis', ['id' => $bankMateri->id]);
    });

    test('guru tidak dapat mengakses bank materi guru lain', function () {
        $guruData1 = createGuruUser();
        
        // Buat guru kedua
        $user2 = \App\Models\User::factory()->guru()->create();
        $guru2 = \App\Models\Guru::factory()->create(['user_id' => $user2->id]);
        
        // Buat bank materi milik guru2
        $bankMateri = \App\Models\BankMateri::create([
            'guru_id' => $guru2->id,
            'nama' => 'Materi Guru Lain',
            'status' => 'published',
        ]);
        
        // Guru1 mencoba update bank materi milik guru2
        $this->actingAs($guruData1['user'])
            ->put("/guru/bank-materi/{$bankMateri->id}", [
                'nama' => 'Coba Update',
                'status' => 'draft',
            ])
            ->assertStatus(403);
    });

    test('guru tidak dapat menghapus bank materi guru lain', function () {
        $guruData1 = createGuruUser();
        
        // Buat guru kedua
        $user2 = \App\Models\User::factory()->guru()->create();
        $guru2 = \App\Models\Guru::factory()->create(['user_id' => $user2->id]);
        
        // Buat bank materi milik guru2
        $bankMateri = \App\Models\BankMateri::create([
            'guru_id' => $guru2->id,
            'nama' => 'Materi Guru Lain',
            'status' => 'published',
        ]);
        
        // Guru1 mencoba hapus bank materi milik guru2
        $this->actingAs($guruData1['user'])
            ->delete("/guru/bank-materi/{$bankMateri->id}")
            ->assertStatus(403);
    });
});

/*
|--------------------------------------------------------------------------
| GURU CRUD OPERATIONS SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Guru CRUD Operations', function () {
    test('guru can store materi', function () {
        $guruData = createGuruUser();
        
        $this->actingAs($guruData['user'])->post('/guru/materi', [
            'kelas_id' => $guruData['kelas']->id,
            'mata_pelajaran_id' => $guruData['mapel']->id,
            'judul' => 'Materi Test',
            'deskripsi' => 'Deskripsi materi test',
        ])->assertRedirect();
    });

    test('guru can store kuis', function () {
        $guruData = createGuruUser();
        
        $this->actingAs($guruData['user'])->post('/guru/kuis', [
            'mata_pelajaran_id' => $guruData['mapel']->id,
            'kelas_ids' => [$guruData['kelas']->id],
            'judul' => 'Kuis Test',
            'deskripsi' => 'Deskripsi kuis test',
            'durasi' => 60,
            'max_attempts' => 3,
            'status' => 'active',
            'questions' => [
                [
                    'pertanyaan' => 'Berapa 1+1?',
                    'options' => [
                        ['teks_opsi' => '1', 'is_correct' => false],
                        ['teks_opsi' => '2', 'is_correct' => true],
                        ['teks_opsi' => '3', 'is_correct' => false],
                        ['teks_opsi' => '4', 'is_correct' => false],
                    ],
                ],
            ],
        ])->assertRedirect();
    });

    test('guru can store tugas', function () {
        $guruData = createGuruUser();
        
        $this->actingAs($guruData['user'])->post('/guru/tugas', [
            'mata_pelajaran_id' => $guruData['mapel']->id,
            'kelas_ids' => [$guruData['kelas']->id],
            'judul' => 'Tugas Test',
            'deskripsi' => 'Deskripsi tugas test',
            'dibuka_pada' => now()->format('Y-m-d H:i:s'),
            'ditutup_pada' => now()->addDays(7)->format('Y-m-d H:i:s'),
            'max_score' => 100,
            'passing_grade' => 75,
            'allow_text_answer' => true,
            'allow_file_upload' => false,
            'status' => 'active',
        ])->assertRedirect();
    });
});

/*
|--------------------------------------------------------------------------
| SISWA ROUTES SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Siswa Routes', function () {
    test('siswa dashboard returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/dashboard')->assertStatus(200);
    });

    test('siswa materi page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/materi')->assertStatus(200);
    });

    test('siswa kuis page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/kuis')->assertStatus(200);
    });

    test('siswa jadwal page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/jadwal')->assertStatus(200);
    });

    test('siswa nilai page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/nilai')->assertStatus(200);
    });

    test('siswa mata pelajaran page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/mata-pelajaran')->assertStatus(200);
    });

    test('siswa tugas page returns successful response', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/siswa/tugas')->assertStatus(200);
    });
});

/*
|--------------------------------------------------------------------------
| AUTHORIZATION SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Authorization', function () {
    test('admin cannot access guru routes', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/guru/dashboard')->assertStatus(403);
    });

    test('admin cannot access siswa routes', function () {
        $admin = createAdminUser();
        $this->actingAs($admin)->get('/siswa/dashboard')->assertStatus(403);
    });

    test('guru cannot access admin routes', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/admin/dashboard')->assertStatus(403);
    });

    test('guru cannot access siswa routes', function () {
        $guruData = createGuruUser();
        $this->actingAs($guruData['user'])->get('/siswa/dashboard')->assertStatus(403);
    });

    test('siswa cannot access admin routes', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/admin/dashboard')->assertStatus(403);
    });

    test('siswa cannot access guru routes', function () {
        $siswaData = createSiswaUser();
        $this->actingAs($siswaData['user'])->get('/guru/dashboard')->assertStatus(403);
    });

    test('unauthenticated user is redirected to login', function () {
        $this->get('/admin/dashboard')->assertRedirect('/login');
    });
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATION SMOKE TESTS
|--------------------------------------------------------------------------
*/

describe('Authentication', function () {
    test('user can login', function () {
        $user = User::factory()->create(['password' => bcrypt('password')]);
        
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);
        
        $this->assertAuthenticated();
    });

    test('user cannot login with wrong password', function () {
        $user = User::factory()->create(['password' => bcrypt('password')]);
        
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
        
        $this->assertGuest();
    });

    test('user can logout', function () {
        $user = User::factory()->create();
        
        $this->actingAs($user)->post('/logout')->assertRedirect('/');
        $this->assertGuest();
    });
});
