<?php

namespace App\Http\Controllers;

use App\Exports\KelasExport;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminKelasController extends Controller
{
    public function index()
    {
        $kelas = Kelas::withCount(['siswa', 'guru'])->get();

        return Inertia::render('admin/Kelas/KelasPage', [
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

    public function export()
    {
        $fileName = 'data_kelas_' . now()->format('Y_m_d_His') . '.xlsx';

        return Excel::download(new KelasExport(), $fileName);
    }

    public function detail($id)
    {
        $kelas = Kelas::with(['siswa.user'])
            ->withCount(['siswa', 'guru'])
            ->findOrFail($id);

        $students = $kelas->siswa->map(function ($siswa) {
            $user = $siswa->user;

            return [
                'id'            => $siswa->id,
                'name'          => $user->name ?? '-',
                'email'         => $user->email ?? '-',
                'nis'           => $siswa->nis ?? '-',
                'jenis_kelamin' => $user->jenis_kelamin ?? '-',
                'no_telp'       => $siswa->no_telp ?? '-',
            ];
        });

        return response()->json([
            'id'          => $kelas->id,
            'tingkat'     => $kelas->tingkat,
            'kelas'       => $kelas->kelas,
            'tahun_ajaran'=> $kelas->tahun_ajaran,
            'siswa_count' => $kelas->siswa_count,
            'guru_count'  => $kelas->guru_count,
            'students'    => $students,
        ]);
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
