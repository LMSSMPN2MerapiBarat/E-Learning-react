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
    // 📄 Daftar User (Index)
    public function index(Request $request)
    {
        $role = $request->query('role');
        $users = $role ? User::where('role', $role)->get() : User::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'role' => $role,
        ]);
    }

    // ➕ Form Tambah User
    public function create(Request $request)
    {
        $role = $request->query('role');

        return Inertia::render('Admin/Users/Create', [
            'role' => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
        ]);
    }

    // 💾 Simpan User Baru
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,guru,siswa',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'nip' => $request->nip,
            'nis' => $request->nis,
            'kelas' => $request->kelas,
            'no_telp' => $request->no_telp,
        ]);

        if ($request->role === 'guru' && $request->filled('mata_pelajaran')) {
            $user->mataPelajaran()->sync($request->mata_pelajaran);
        }

        // ✅ KUNCI: redirect ke route dashboard agar Inertia reload otomatis
        return redirect()->route('admin.dashboard')
            ->with('success', 'Siswa berhasil ditambahkan.');
    }


    // ✏️ Edit User
    public function edit(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $role = $request->query('role');

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'role' => $role,
            'mataPelajarans' => $role === 'guru' ? MataPelajaran::all() : [],
            'selectedMapel' => $role === 'guru'
                ? $user->mataPelajaran()->pluck('mata_pelajaran_id')->toArray()
                : [],
        ]);
    }

    // 🔁 Update User
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:admin,guru,siswa',
        ]);

        $data = $request->only(['name', 'email', 'role', 'nip', 'nis', 'kelas', 'no_telp']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        if ($user->role === 'guru') {
            $user->mataPelajaran()->sync($request->mata_pelajaran ?? []);
        }

        return redirect()->route('admin.users.index', ['role' => $user->role])
            ->with('success', 'Data pengguna berhasil diperbarui.');
    }

    // ❌ Hapus User Tunggal
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $role = $user->role;
        if ($role === 'guru') {
            $user->mataPelajaran()->detach();
        }
        $user->delete();

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }

    // 🧹 Bulk Delete
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids');

        if (!$ids || count($ids) === 0) {
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

    // 📥 Import Excel
    public function importExcel(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
            'role' => 'required|in:guru,siswa',
        ]);

        if ($request->role === 'guru') {
            Excel::import(new GuruImport, $request->file('file'));
        } else {
            Excel::import(new SiswaImport, $request->file('file'));
        }

        return back()->with('success', 'Data ' . ucfirst($request->role) . ' berhasil diimport dari Excel!');
    }

    // 📤 Export Excel
    public function exportExcel($role)
    {
        return match ($role) {
            'guru' => Excel::download(new GuruExport, 'Data_Guru.xlsx'),
            'siswa' => Excel::download(new SiswaExport, 'Data_Siswa.xlsx'),
            default => back()->with('error', 'Role tidak valid!'),
        };
    }
}
