<?php

namespace App\Http\Controllers;

use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                    'jenis_kelamin' => $s->user->jenis_kelamin,
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

    /**
     * Hapus seluruh data siswa dan akunnya.
     */
    public function destroyAll()
    {
        $total = Siswa::count();

        if ($total === 0) {
            return back()->with('info', 'Tidak ada data siswa yang perlu dihapus.');
        }

        $deleted = 0;

        DB::transaction(function () use (&$deleted) {
            Siswa::query()
                ->with('user')
                ->chunkById(200, function ($chunk) use (&$deleted) {
                    foreach ($chunk as $siswa) {
                        if ($siswa->user) {
                            $siswa->user->delete();
                        }

                        if ($siswa->exists) {
                            $siswa->delete();
                        }

                        $deleted++;
                    }
                });
        });

        return back()->with('success', $deleted . ' siswa beserta akun terkait berhasil dihapus.');
    }
}
