<?php

namespace App\Http\Controllers;

use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminKelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount(['siswa', 'guru'])->get();

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
        $validated = $request->validate(
            [
                'tingkat'       => 'required|string|max:50',
                'kelas'         => ['required', 'string', 'max:50', Rule::unique('kelas', 'kelas')],
                'tahun_ajaran'  => 'required|string|max:20',
                'deskripsi'     => 'nullable|string',
            ],
            [
                'kelas.unique' => 'Nama kelas sudah digunakan.',
            ]
        );

        Kelas::create($validated);

        return redirect()->back()->with('success', 'Kelas berhasil ditambahkan.');
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
        $validated = $request->validate(
            [
                'tingkat'       => 'required|string|max:50',
                'kelas'         => ['required', 'string', 'max:50', Rule::unique('kelas', 'kelas')->ignore($id)],
                'tahun_ajaran'  => 'required|string|max:20',
                'deskripsi'     => 'nullable|string',
            ],
            [
                'kelas.unique' => 'Nama kelas sudah digunakan.',
            ]
        );

        $kelas = Kelas::findOrFail($id);
        $kelas->update($validated);

        return redirect()->back()->with('success', 'Kelas berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $kelas = Kelas::findOrFail($id);
        $kelas->delete();

        return redirect()->back()->with('success', 'Kelas berhasil dihapus.');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);
        Kelas::whereIn('id', $ids)->delete();

        return redirect()->back()->with('success', 'Beberapa kelas berhasil dihapus.');
    }

    /**
     * Dipakai untuk dropdown di Create/Edit Siswa
     */
    public function list()
    {
        return response()->json(
            Kelas::select('id', 'tingkat', 'kelas', 'tahun_ajaran')->get()
        );
    }
}
