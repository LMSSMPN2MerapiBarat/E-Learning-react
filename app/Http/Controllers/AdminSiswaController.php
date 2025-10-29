<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSiswaController extends Controller
{
    /**
     * Tampilkan daftar siswa (flatten untuk tampilan tabel)
     */
    public function index()
    {
        $siswas = Siswa::with(['user', 'kelas'])
            ->get()
            ->map(function ($s) {
                return [
                    'id'       => $s->user->id,
                    'name'     => $s->user->name,
                    'email'    => $s->user->email,
                    'nis'      => $s->nis,
                    'no_telp'  => $s->no_telp,
                    'kelas'    => $s->kelas?->kelas ?? '-',
                    'kelas_id' => $s->kelas?->id,
                    'siswa_id' => $s->id,
                    'user_id'  => $s->user_id,
                ];
            });

        return Inertia::render('admin/siswa/Siswa', [
            'students' => $siswas,
        ]);
    }

    /**
     * Hapus satu siswa (beserta user-nya)
     */
    public function destroy(Siswa $siswa)
    {
        if ($siswa->user) {
            $siswa->user->delete(); // hapus user terkait
        }

        $siswa->delete();

        return back()->with('success', 'Siswa berhasil dihapus beserta akunnya.');
    }

    /**
     * Bulk delete (hapus banyak siswa sekaligus)
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return back()->with('error', 'Tidak ada siswa yang dipilih untuk dihapus.');
        }

        $siswas = Siswa::whereIn('id', $ids)->with('user')->get();

        foreach ($siswas as $siswa) {
            if ($siswa->user) {
                $siswa->user->delete();
            }
            $siswa->delete();
        }

        return back()->with('success', count($ids) . ' siswa berhasil dihapus beserta akunnya.');
    }
}
