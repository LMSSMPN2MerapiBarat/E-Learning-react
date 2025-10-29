<?php

namespace App\Http\Controllers;

use App\Models\User;
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
     * 📄 Tampilkan daftar pengguna berdasarkan role (admin/guru/siswa)
     */
    public function index(Request $request)
    {
        $role = $request->query('role');

        $users = User::when($role, fn($q) => $q->where('role', $role))
            ->with(['kelas:id,nama_kelas'])
            ->latest()
            ->paginate(10);

        // Hindari overwrite nama relasi 'kelas'. Tambahkan field turunan.
        $users->getCollection()->transform(function ($user) {
            if ($user->role === 'siswa') {
                $kelas = $user->kelas ? $user->kelas->first() : null;
                $user->kelas_nama = $kelas->nama_kelas ?? '-';
                $user->kelas_id = $kelas->id ?? null;
            } else {
                $user->kelas_nama = '-';
                $user->kelas_id = null;
            }
            return $user;
        });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'role'  => $role,
        ]);
    }

    /**
     * 📊 Dashboard Admin — Menampilkan statistik dan daftar siswa
     */
    public function dashboard()
    {
        $totalGuru = User::where('role', 'guru')->count();
        $totalSiswa = User::where('role', 'siswa')->count();
        $totalMateri = 0;
        $totalKuis = 0;

        $students = User::where('role', 'siswa')
            ->with(['kelas:id,nama_kelas'])
            ->get()
            ->map(function ($u) {
                $kelas = $u->kelas ? $u->kelas->first() : null;
                return [
                    'id'      => $u->id,
                    'name'    => $u->name,
                    'nis'     => $u->nis,
                    'kelas'   => $kelas ? $kelas->nama_kelas : '-',
                    'email'   => $u->email,
                    'no_telp' => $u->no_telp,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'totalGuru'   => $totalGuru,
            'totalSiswa'  => $totalSiswa,
            'totalMateri' => $totalMateri,
            'totalKuis'   => $totalKuis,
            'students'    => $students,
        ]);
    }

    /**
     * ➕ Form tambah pengguna baru
     */
    public function create(Request $request)
    {
        $role = $request->query('role');

        return Inertia::render('Admin/Users/Create', [
            'role'           => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
            'kelasList'      => $role === 'siswa' ? Kelas::select('id', 'nama_kelas')->get() : [],
        ]);
    }

    /**
     * 💾 Simpan pengguna baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:6',
            'nip'      => 'nullable|string|max:20',
            'nis'      => 'nullable|string|max:20',
            'kelas_id' => 'nullable|exists:kelas,id',
            'no_telp'  => 'nullable|string|max:20',
            'role'     => 'required|string',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'nip'      => $validated['nip'] ?? null,
            'nis'      => $validated['nis'] ?? null,
            'no_telp'  => $validated['no_telp'] ?? null,
            'role'     => $validated['role'],
        ]);

        // Jika siswa, attach ke pivot kelas_siswa
        if ($user->role === 'siswa' && !empty($validated['kelas_id'])) {
            $user->kelas()->attach($validated['kelas_id']);
        }

        // Kembalikan student baru ke props Inertia (dipakai CreateSiswa.tsx)
        return redirect()->back()->with('newStudent', $user);
    }

    /**
     * 🔁 Update data pengguna
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email,' . $id,
            'role'     => 'required|in:admin,guru,siswa',
            'kelas_id' => 'nullable|exists:kelas,id',
        ]);

        $data = $request->only(['name', 'email', 'role', 'nip', 'nis', 'no_telp']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        // Guru: sinkron relasi mapel HANYA jika diberikan sebagai array mata_pelajaran
        if ($user->role === 'guru') {
            $mataPelajaran = $request->input('mata_pelajaran');
            if (is_array($mataPelajaran)) {
                $user->mataPelajaran()->sync($mataPelajaran);
            }
        }

        // Siswa: sinkron relasi kelas HANYA jika field kelas_id ADA di request
        if ($user->role === 'siswa' && $request->has('kelas_id')) {
            $kelasId = $request->input('kelas_id');
            $user->kelas()->sync($kelasId ? [$kelasId] : []);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Data pengguna berhasil diperbarui.',
                'user'    => $user,
            ]);
        }

        return redirect()->back()->with('success', 'Data berhasil diperbarui.');
    }

    /**
     * ❌ Hapus satu pengguna
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'guru') {
            $user->mataPelajaran()->detach();
        }

        if ($user->role === 'siswa') {
            $user->kelas()->detach();
        }

        $user->delete();

        return back()->with('success', ucfirst($user->role) . ' berhasil dihapus.');
    }

    /**
     * 🧹 Hapus banyak pengguna (bulk delete)
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return back()->with('error', 'Tidak ada data yang dipilih.');
        }

        $users = User::whereIn('id', $ids)->get();

        foreach ($users as $user) {
            if ($user->role === 'guru') {
                $user->mataPelajaran()->detach();
            }
            if ($user->role === 'siswa') {
                $user->kelas()->detach();
            }
            $user->delete();
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => count($ids) . ' pengguna berhasil dihapus.'
            ]);
        }

        return redirect()->back()->with('success', count($ids) . ' pengguna berhasil dihapus.');
    }

    /**
     * 📥 Import Excel
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
            } else {
                Excel::import(new SiswaImport, $request->file('file'));
            }

            return back()->with('success', 'Data ' . ucfirst($request->role) . ' berhasil diimpor dari Excel!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengimpor data: ' . $e->getMessage());
        }
    }

    /**
     * 📤 Export Excel
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
