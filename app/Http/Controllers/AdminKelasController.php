<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminKelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount('siswa')->get();

        return Inertia::render('admin/Kelas/Kelas', [
            'kelas' => $kelas,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Kelas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tingkat' => 'required|string|max:50',
            'nama_kelas' => 'required|string|max:50',
            'tahun_ajaran' => 'required|string|max:20',
            'deskripsi' => 'nullable|string',
        ]);

        Kelas::create($validated);

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $kelas = Kelas::findOrFail($id);

        return Inertia::render('admin/Kelas/Edit', [
            'kelas' => $kelas,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tingkat' => 'required|string|max:50',
            'nama_kelas' => 'required|string|max:50',
            'tahun_ajaran' => 'required|string|max:20',
            'deskripsi' => 'nullable|string',
        ]);

        $kelas = Kelas::findOrFail($id);
        $kelas->update($validated);

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return redirect()->route('admin.kelas.index')->with('success', 'Kelas berhasil dihapus.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Kelas::whereIn('id', $ids)->delete();

        return redirect()->route('admin.kelas.index')->with('success', 'Beberapa kelas berhasil dihapus.');
    }

    /**
     * Dipakai oleh frontend untuk dropdown kelas (Create/Edit Siswa)
     */
    public function list()
    {
        return response()->json(
            Kelas::select('id', 'tingkat', 'nama_kelas', 'tahun_ajaran')->get()
        );
    }
}
