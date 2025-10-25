<?php

namespace App\Http\Controllers;

use App\Models\User;
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
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'role' => $role,
        ]);
    }

    /**
 * 📊 Dashboard Admin — Menampilkan statistik dan daftar siswa
 */
    public function dashboard()
    {
        $totalGuru = User::where('role', 'guru')->count();
        $totalSiswa = User::where('role', 'siswa')->count();
        $totalMateri = 0; // nanti bisa ganti dengan count(Materi::count())
        $totalKuis = 0;   // nanti bisa ganti dengan count(Kuis::count())

        $students = User::where('role', 'siswa')
            ->select('id', 'name', 'nis', 'kelas', 'email', 'no_telp')
            ->get();

        return Inertia::render('admin/dashboard', [
            'totalGuru' => $totalGuru,
            'totalSiswa' => $totalSiswa,
            'totalMateri' => $totalMateri,
            'totalKuis' => $totalKuis,
            'students' => $students,
        ]);
    }


    /**
     * ➕ Form tambah pengguna baru
     */
    public function create(Request $request)
    {
        $role = $request->query('role');

        return Inertia::render('Admin/Users/Create', [
            'role' => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
        ]);
    }

    /**
     * 💾 Simpan pengguna baru
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|in:admin,guru,siswa',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'nip'      => $request->nip,
            'nis'      => $request->nis,
            'kelas'    => $request->kelas,
            'no_telp'  => $request->no_telp,
        ]);

        if ($user->role === 'guru' && $request->filled('mata_pelajaran')) {
            $user->mataPelajaran()->sync($request->mata_pelajaran);
        }

        return redirect()
            ->route('admin.users.index', ['role' => $user->role])
            ->with('success', ucfirst($user->role) . ' berhasil ditambahkan.');
    }

    /**
     * ✏️ Form edit pengguna
     */
    public function edit(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $role = $request->query('role', $user->role);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'role' => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
            'selectedMapel' => $role === 'guru'
                ? $user->mataPelajaran()->pluck('mata_pelajaran_id')->toArray()
                : [],
        ]);
    }

    /**
     * 🔁 Update data pengguna
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'  => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $id,
            'role'  => 'required|in:admin,guru,siswa',
        ]);

        $data = $request->only(['name', 'email', 'role', 'nip', 'nis', 'kelas', 'no_telp']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($user->role === 'guru') {
            $user->mataPelajaran()->sync($request->mata_pelajaran ?? []);
        }

        return redirect()
            ->route('admin.users.index', ['role' => $user->role])
            ->with('success', 'Data ' . ucfirst($user->role) . ' berhasil diperbarui.');
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
            return response()->json(['message' => 'Tidak ada data yang dipilih.'], 400);
        }

        $users = User::whereIn('id', $ids)->get();

        foreach ($users as $user) {
            if ($user->role === 'guru') {
                $user->mataPelajaran()->detach();
            }
            $user->delete();
        }

        return response()->json([
            'message' => count($ids) . ' pengguna berhasil dihapus.'
        ]);
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
