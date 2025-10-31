<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\GuruImport;
use App\Imports\SiswaImport;
use App\Exports\GuruExport;
use App\Exports\SiswaExport;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Tampilkan daftar pengguna
     */
    public function index(Request $request)
    {
        $role = $request->query('role');

        $users = User::when($role, fn($q) => $q->where('role', $role))
            ->with(['siswa.kelas', 'guru'])
            ->latest()
            ->paginate(10);

        $users->getCollection()->transform(function ($user) {
            if ($user->role === 'siswa') {
                $kelas = $user->siswa?->kelas;
                $user->kelas_nama = $kelas?->kelas ?? '-';
                $user->kelas_id   = $kelas?->id ?? null;
                $user->nis        = $user->siswa?->nis;
                $user->no_telp    = $user->siswa?->no_telp;
            } elseif ($user->role === 'guru') {
                $user->kelas_nama = '-';
                $user->kelas_id   = null;
                $user->nip        = $user->guru?->nip;
                $user->mapel      = $user->guru?->mapel;
                $user->no_telp    = $user->guru?->no_telp;
            } else {
                $user->kelas_nama = '-';
                $user->kelas_id   = null;
            }
            return $user;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'role'  => $role,
        ]);
    }

    /**
     * Dashboard Admin
     */
    public function dashboard()
    {
        $totalGuru  = User::where('role', 'guru')->count();
        $totalSiswa = User::where('role', 'siswa')->count();

        $students = Siswa::with(['user', 'kelas'])
            ->get()
            ->map(function ($s) {
                return [
                    'id'      => $s->user?->id ?? $s->id,
                    'name'    => $s->user?->name,
                    'nis'     => $s->nis,
                    'kelas'   => $s->kelas?->kelas,
                    'email'   => $s->user?->email,
                    'no_telp' => $s->no_telp,
                ];
            })
            ->values();

        $gurus = Guru::with(['user', 'mataPelajaran', 'kelas'])
            ->get()
            ->map(function ($g) {
                $mapelNames = $g->mataPelajaran
                    ->pluck('nama_mapel')
                    ->filter()
                    ->unique()
                    ->values();

                $mapel = $mapelNames->isNotEmpty()
                    ? $mapelNames->implode(', ')
                    : ($g->mapel ?? null);

                $kelasNames = $g->kelas
                    ->map(function ($kelas) {
                        $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
                        return $nama !== '' ? $nama : ($kelas->kelas ?? null);
                    })
                    ->filter()
                    ->unique()
                    ->values();

                return [
                    'id'    => $g->id,
                    'name'  => $g->user?->name,
                    'email' => $g->user?->email,
                    'mapel' => $mapel,
                    'kelas' => $kelasNames->implode(', '),
                ];
            })
            ->values();

        $kelas = Kelas::with('guru')
            ->get()
            ->map(function ($k) {
                $waliKelas = $k->guru->first();

                $namaKelas = trim(($k->tingkat ?? '') . ' ' . ($k->kelas ?? ''));

                return [
                    'id'              => $k->id,
                    'nama'            => $namaKelas !== '' ? $namaKelas : ($k->kelas ?? null),
                    'wali'            => $waliKelas?->name,
                    'jumlah_pengajar' => $k->guru->count(),
                ];
            })
            ->values();

        $mapels = MataPelajaran::with('gurus.user')
            ->get()
            ->map(function ($m) {
                $guruNames = $m->gurus
                    ->map(fn($guru) => $guru->user?->name)
                    ->filter()
                    ->unique()
                    ->values();

                $guruList = $guruNames->isNotEmpty()
                    ? $guruNames->implode(', ')
                    : null;

                return [
                    'id'   => $m->id,
                    'nama' => $m->nama_mapel,
                    'guru' => $guruList,
                ];
            })
            ->values();

        return Inertia::render('admin/dashboard', [
            'totalGuru'   => $totalGuru,
            'totalSiswa'  => $totalSiswa,
            'totalMateri' => $kelas->count(),
            'totalKuis'   => $mapels->count(),
            'students'    => $students,
            'gurus'       => $gurus,
            'kelas'       => $kelas,
            'mapels'      => $mapels,
        ]);
    }

    /**
     * Tambah pengguna baru
     */
    public function create(Request $request)
    {
        $role = $request->query('role');

        return Inertia::render('Admin/Users/Create', [
            'role'           => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
            'kelasList'      => $role === 'siswa' ? Kelas::select('id', 'kelas')->get() : [],
        ]);
    }

    /**
     * Simpan pengguna baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role'     => 'required|in:admin,guru,siswa',
            'nip'      => 'required_if:role,guru|digits:18',
            'mapel'    => 'nullable|string|max:255',
            'nis'      => 'required_if:role,siswa|digits:10',
            'kelas_id' => 'nullable|exists:kelas,id',
            'no_telp'  => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        if ($user->role === 'siswa') {
            Siswa::create([
                'user_id'  => $user->id,
                'nis'      => $validated['nis'] ?? null,
                'kelas_id' => $validated['kelas_id'] ?? null,
                'no_telp'  => $validated['no_telp'] ?? null,
            ]);
        }

        if ($user->role === 'guru') {
            Guru::create([
                'user_id' => $user->id,
                'nip'     => $validated['nip'] ?? null,
                'mapel'   => $validated['mapel'] ?? null,
                'no_telp' => $validated['no_telp'] ?? null,
            ]);
        }

        return back()->with('success', 'Pengguna berhasil ditambahkan!');
    }

    /**
     * Update data pengguna
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email,' . $id,
            'role'     => 'required|in:admin,guru,siswa',
            'password' => 'nullable|string|min:8',
            'kelas_id' => 'nullable|exists:kelas,id',
            'nis'      => 'nullable|digits:10',
            'nip'      => 'nullable|digits:18',
            'mapel'    => 'nullable|string|max:255',
            'no_telp'  => 'nullable|string|max:20',
        ]);

        $data = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // sinkron profil
        if ($user->role === 'siswa') {
            $profil = Siswa::firstOrCreate(['user_id' => $user->id]);
            $profil->update([
                'nis'      => $validated['nis'] ?? $profil->nis,
                'kelas_id' => $validated['kelas_id'] ?? $profil->kelas_id,
                'no_telp'  => $validated['no_telp'] ?? $profil->no_telp,
            ]);
        } elseif ($user->role === 'guru') {
            $profil = Guru::firstOrCreate(['user_id' => $user->id]);
            $profil->update([
                'nip'     => $validated['nip'] ?? $profil->nip,
                'mapel'   => $validated['mapel'] ?? $profil->mapel,
                'no_telp' => $validated['no_telp'] ?? $profil->no_telp,
            ]);
        }

        return back()->with('success', 'Pengguna berhasil diperbarui!');
    }

    /**
     * Hapus satu pengguna
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete(); // cascade akan hapus guru/siswa
        return back()->with('success', ucfirst($user->role) . ' berhasil dihapus.');
    }

    /**
     * Hapus banyak pengguna (bulk delete)
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return back()->with('error', 'Tidak ada data yang dipilih.');
        }

        $users = User::whereIn('id', $ids)->get();
        foreach ($users as $user) {
            $user->delete();
        }

        return back()->with('success', count($ids) . ' pengguna berhasil dihapus.');
    }

    /**
     * Import Excel (guru/siswa)
     */
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
            'role' => 'required|in:guru,siswa',
        ]);

        try {
            if ($request->role === 'guru') {
                Excel::import(new GuruImport, $request->file('file'));
            } elseif ($request->role === 'siswa') {
                Excel::import(new SiswaImport, $request->file('file'));
            }

            return back()->with('success', '✅ Data ' . ucfirst($request->role) . ' berhasil diimpor!');
        } catch (\Exception $e) {
            return back()->with('error', '❌ Gagal mengimpor: ' . $e->getMessage());
        }
    }

    /**
     * Export Excel
     */
    public function exportExcel($role)
    {
        return match ($role) {
            'guru'  => Excel::download(new GuruExport, 'Data_Guru.xlsx'),
            'siswa' => Excel::download(new SiswaExport, 'Data_Siswa.xlsx'),
            default => back()->with('error', 'Role tidak valid!'),
        };
    }
}
