<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use App\Models\User;
use Illuminate\Http\Request;

class AdminKelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::with(['guru', 'siswa'])->get();
        return view('admin.kelas.index', compact('kelas'));
    }

    public function create()
    {
        $guru = User::where('role', 'guru')->get();
        $siswa = User::where('role', 'siswa')->get();
        return view('admin.kelas.create', compact('guru', 'siswa'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'guru_ids' => 'array|nullable',
            'siswa_ids' => 'array|nullable',
        ]);

        $kelas = Kelas::create([
            'nama_kelas' => $validated['nama_kelas'],
        ]);

        if (!empty($request->guru_ids)) {
            $kelas->guru()->attach($request->guru_ids);
        }

        if (!empty($request->siswa_ids)) {
            $kelas->siswa()->attach($request->siswa_ids);
        }

        return redirect()->route('admin.kelas.index')
                         ->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $kelas = Kelas::findOrFail($id);
        $guru = User::where('role', 'guru')->get();
        $siswa = User::where('role', 'siswa')->get();

        return view('admin.kelas.edit', compact('kelas', 'guru', 'siswa'));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_kelas' => 'required|string|max:255',
            'guru_ids' => 'array|nullable',
            'siswa_ids' => 'array|nullable',
        ]);

        $kelas = Kelas::findOrFail($id);
        $kelas->update(['nama_kelas' => $validated['nama_kelas']]);

        $kelas->guru()->sync($request->guru_ids ?? []);
        $kelas->siswa()->sync($request->siswa_ids ?? []);

        return redirect()->route('admin.kelas.index')
                         ->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->guru()->detach();
        $kelas->siswa()->detach();
        $kelas->delete();

        return redirect()->route('admin.kelas.index')
                         ->with('success', 'Kelas berhasil dihapus.');
    }

    public function bulkDelete(Request $request)
    {
        // pastikan menerima JSON array
        $ids = $request->input('ids', []);

        if (empty($ids) || !is_array($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data yang dipilih untuk dihapus.'
            ], 400);
        }

        try {
            Kelas::whereIn('id', $ids)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Beberapa kelas berhasil dihapus.'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
}
