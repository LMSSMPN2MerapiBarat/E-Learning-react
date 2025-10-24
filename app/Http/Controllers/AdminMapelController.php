<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use Illuminate\Http\Request;

class AdminMapelController extends Controller
{
    public function index()
    {
        $mapels = MataPelajaran::all();
        return view('admin.mapel.index', compact('mapels'));
    }

    public function create()
    {
        return view('admin.mapel.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_mapel' => 'required|string|max:255',
        ]);

        MataPelajaran::create($request->only('nama_mapel'));

        return redirect()->route('admin.mapel.index')
                         ->with('success', 'Mata pelajaran berhasil ditambahkan!');
    }

    public function edit(MataPelajaran $mapel)
    {
        return view('admin.mapel.edit', compact('mapel'));
    }

    public function update(Request $request, MataPelajaran $mapel)
    {
        $request->validate([
            'nama_mapel' => 'required|string|max:255',
        ]);

        $mapel->update($request->only('nama_mapel'));

        return redirect()->route('admin.mapel.index')
                         ->with('success', 'Mata pelajaran berhasil diperbarui!');
    }

    public function destroy(MataPelajaran $mapel)
    {
        $mapel->delete();

        return redirect()->route('admin.mapel.index')
                         ->with('success', 'Mata pelajaran berhasil dihapus!');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada data yang dipilih untuk dihapus.',
            ], 400);
        }

        MataPelajaran::whereIn('id', $ids)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Beberapa mata pelajaran berhasil dihapus.',
        ]);
    }
}
