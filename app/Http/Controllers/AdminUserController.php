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
        $totalMateri = 0;
        $totalKuis = 0;

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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'nis' => 'nullable|string|max:20',
            'kelas' => 'nullable|string|max:20',
            'no_telp' => 'nullable|string|max:20',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'nis' => $validated['nis'] ?? null,
            'kelas' => $validated['kelas'] ?? null,
            'no_telp' => $validated['no_telp'] ?? null,
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('newStudent', $user);
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

        // 🔥 Return JSON agar frontend bisa langsung update data tanpa reload
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Data siswa berhasil diperbarui.',
                'user' => $user,
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
