<?php

namespace App\Http\Controllers;

use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminMapelController extends Controller
{
    public function index()
    {
        $mapels = MataPelajaran::withCount('gurus')->get();

        return Inertia::render('admin/Mapel/Mapel', [
            'mapels' => $mapels,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/Mapel/Create');
    }

    public function store(Request $request)
    {
        $request->validate(
            [
                'nama_mapel' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('mata_pelajarans', 'nama_mapel'),
                ],
            ],
            [
                'nama_mapel.unique' => 'Nama Mata Pelajaran sudah digunakan.',
            ]
        );

        MataPelajaran::create($request->only('nama_mapel'));

        return redirect()->route('admin.mapel.index')
                         ->with('success', 'Mata pelajaran berhasil ditambahkan!');
    }

    public function edit(MataPelajaran $mapel)
    {
        return Inertia::render('admin/Mapel/Edit', [
            'mapel' => $mapel,
        ]);
    }

    public function update(Request $request, MataPelajaran $mapel)
    {
        $request->validate(
            [
                'nama_mapel' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('mata_pelajarans', 'nama_mapel')->ignore($mapel->id),
                ],
            ],
            [
                'nama_mapel.unique' => 'Nama Mata Pelajaran sudah digunakan.',
            ]
        );

        $mapel->update($request->only('nama_mapel'));

        return redirect()->route('admin.mapel.index')
                         ->with('success', 'Mata pelajaran berhasil diperbarui!');
    }

    public function destroy(MataPelajaran $mapel)
    {
        $mapel->delete();

        return back()->with('success', 'Mata pelajaran berhasil dihapus!');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return back()->with('error', 'Tidak ada data yang dipilih untuk dihapus.');
        }

        MataPelajaran::whereIn('id', $ids)->delete();

        // gunakan redirect agar Inertia tidak error JSON
        return back()->with('success', 'Beberapa mata pelajaran berhasil dihapus!');
    }

    public function detail(MataPelajaran $mapel)
    {
        $mapel->load(['gurus.user', 'gurus.kelas']);

        $gurus = $mapel->gurus->map(function ($guru) {
            $user = $guru->user;

            $kelas = $guru->kelas
                ? $guru->kelas->map(function ($kelasItem) {
                    $tingkat = trim((string) ($kelasItem->tingkat ?? ''));
                    $nama = trim((string) ($kelasItem->kelas ?? ''));
                    $label = trim($tingkat . ' ' . $nama);
                    return $label !== '' ? $label : ($nama ?: ($tingkat ?: '-'));
                })->filter()->values()
                : collect();

            return [
                'id'      => $guru->id,
                'name'    => $user->name ?? '-',
                'email'   => $user->email ?? '-',
                'no_telp' => $guru->no_telp ?? $user->no_telp ?? '-',
                'kelas'   => $kelas->values()->all(),
            ];
        });

        return response()->json([
            'id'         => $mapel->id,
            'nama_mapel' => $mapel->nama_mapel,
            'total_guru' => $gurus->count(),
            'gurus'      => $gurus,
        ]);
    }

    // untuk dropdown di form tambah guru
    public function list()
    {
        return response()->json(MataPelajaran::select('id', 'nama_mapel')->get());
    }
}
