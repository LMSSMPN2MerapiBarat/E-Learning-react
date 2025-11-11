<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Siswa;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
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
                    'jenis_kelamin' => $s->user?->jenis_kelamin,
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
                    'jenis_kelamin' => $g->user?->jenis_kelamin,
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

        return Inertia::render('admin/Dashboard', [
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
        $validated = $request->validate(
            [
                'name'     => ['required', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
                'jenis_kelamin' => ['required', 'in:laki-laki,perempuan'],
                'email'    => 'required|email|unique:users',
                'password' => 'required|string|min:8',
                'role'     => 'required|in:admin,guru,siswa',
                'nip'      => 'required_if:role,guru|digits:18|unique:gurus,nip',
                'mapel'    => 'nullable|string|max:255',
                'nis'      => 'required_if:role,siswa|digits:10|unique:siswas,nis',
                'kelas_id' => 'nullable|exists:kelas,id',
                'no_telp'  => ['nullable', 'digits_between:9,12'],
                'tempat_lahir' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
                'tanggal_lahir' => ['nullable', 'date', 'before_or_equal:today'],
            ],
            [
                'name.regex'                => 'Nama hanya boleh berisi huruf dan spasi.',
                'jenis_kelamin.in'          => 'Pilih jenis kelamin yang valid.',
                'no_telp.digits_between'    => 'No. telepon harus terdiri dari 9 sampai 12 digit angka.',
                'nip.unique'                => 'NIP sudah terdaftar.',
                'nis.unique'                => 'NIS sudah terdaftar.',
                'tempat_lahir.regex'        => 'Tempat lahir hanya boleh berisi huruf dan spasi.',
                'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            ]
        );

        $normalizedNip = isset($validated['nip'])
            ? preg_replace('/\D+/', '', $validated['nip'])
            : null;
        $normalizedNis = isset($validated['nis'])
            ? preg_replace('/\D+/', '', $validated['nis'])
            : null;

        $user = User::create([
            'name'     => $validated['name'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        if ($user->role === 'siswa') {
            Siswa::create([
                'user_id'  => $user->id,
                'nis'      => $normalizedNis,
                'kelas_id' => $validated['kelas_id'] ?? null,
                'no_telp'  => $validated['no_telp'] ?? null,
                'tempat_lahir' => $validated['tempat_lahir'] ?? null,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? null,
            ]);
        }

        if ($user->role === 'guru') {
            Guru::create([
                'user_id' => $user->id,
                'nip'     => $normalizedNip,
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

        $validated = $request->validate(
            [
                'name'     => ['required', 'string', 'max:100', 'regex:/^[\pL\s]+$/u'],
                'jenis_kelamin' => ['required', 'in:laki-laki,perempuan'],
                'email'    => 'required|email|unique:users,email,' . $id,
                'role'     => 'required|in:admin,guru,siswa',
                'password' => 'nullable|string|min:8',
                'kelas_id' => 'nullable|exists:kelas,id',
                'nis'      => [
                    'nullable',
                    'digits:10',
                    Rule::unique('siswas', 'nis')->ignore(optional($user->siswa)->id),
                ],
                'nip'      => [
                    'nullable',
                    'digits:18',
                    Rule::unique('gurus', 'nip')->ignore(optional($user->guru)->id),
                ],
                'mapel'    => 'nullable|string|max:255',
                'no_telp'  => ['nullable', 'digits_between:9,12'],
                'tempat_lahir' => ['nullable', 'string', 'max:255', 'regex:/^[\pL\s]+$/u'],
                'tanggal_lahir' => ['nullable', 'date', 'before_or_equal:today'],
            ],
            [
                'name.regex'                => 'Nama hanya boleh berisi huruf dan spasi.',
                'jenis_kelamin.in'          => 'Pilih jenis kelamin yang valid.',
                'no_telp.digits_between'    => 'No. telepon harus terdiri dari 9 sampai 12 digit angka.',
                'nip.unique'                => 'NIP sudah terdaftar.',
                'nis.unique'                => 'NIS sudah terdaftar.',
                'tempat_lahir.regex'        => 'Tempat lahir hanya boleh berisi huruf dan spasi.',
                'tanggal_lahir.before_or_equal' => 'Tanggal lahir tidak boleh melebihi hari ini.',
            ]
        );

        $data = [
            'name'  => $validated['name'],
            'jenis_kelamin' => $validated['jenis_kelamin'],
            'email' => $validated['email'],
            'role'  => $validated['role'],
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // sinkron profil
        $normalizedNis = isset($validated['nis'])
            ? preg_replace('/\D+/', '', $validated['nis'])
            : null;
        $normalizedNip = isset($validated['nip'])
            ? preg_replace('/\D+/', '', $validated['nip'])
            : null;

        if ($user->role === 'siswa') {
            $profil = Siswa::firstOrCreate(['user_id' => $user->id]);
            $profil->update([
                'nis'      => $normalizedNis ?? $profil->nis,
                'kelas_id' => $validated['kelas_id'] ?? $profil->kelas_id,
                'no_telp'  => $validated['no_telp'] ?? $profil->no_telp,
                'tempat_lahir' => $validated['tempat_lahir'] ?? $profil->tempat_lahir,
                'tanggal_lahir' => $validated['tanggal_lahir'] ?? $profil->tanggal_lahir,
            ]);
        } elseif ($user->role === 'guru') {
            $profil = Guru::firstOrCreate(['user_id' => $user->id]);
            $profil->update([
                'nip'     => $normalizedNip ?? $profil->nip,
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
            $summary = null;

            if ($request->role === 'guru') {
                $importer = new GuruImport();
                Excel::import($importer, $request->file('file'));
                $summary = $importer->summary();
            } elseif ($request->role === 'siswa') {
                $importer = new SiswaImport();
                Excel::import($importer, $request->file('file'));
                $summary = $importer->summary();
            }

            $message = '?o. Data ' . ucfirst($request->role) . ' berhasil diimpor!';
            if ($summary) {
                $message .= sprintf(
                    ' %d baris diproses, %d berhasil, %d dilewati.',
                    $summary['processed'] ?? 0,
                    $summary['created'] ?? 0,
                    $summary['skipped'] ?? 0
                );
            }

            return back()->with([
                'success' => $message,
                'import_summary' => $summary,
            ]);
        } catch (ValidationException $e) {
            $firstError = collect($e->errors())->flatten()->first();
            return back()->with('error', '❌ Gagal mengimpor: ' . ($firstError ?? $e->getMessage()));
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
