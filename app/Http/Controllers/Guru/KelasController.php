<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()
            ->with([
                'kelas' => function ($query) {
                    $query->with(['siswa.user']);
                },
            ])
            ->firstOrFail();

        $classes = $guru->kelas
            ->map(function ($kelas) {
                $students = $kelas->siswa
                    ->map(function ($siswa) {
                        return [
                            'id'       => $siswa->id,
                            'nama'     => optional($siswa->user)->name,
                            'nis'      => $siswa->nis,
                            'email'    => optional($siswa->user)->email,
                            'no_telp'  => $siswa->no_telp,
                        ];
                    })
                    ->sortBy(function ($student) {
                        return strtolower($student['nama'] ?? '');
                    }, SORT_REGULAR, false)
                    ->values();

                $kelasName = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));

                return [
                    'id'            => $kelas->id,
                    'nama'          => $kelasName !== '' ? $kelasName : ($kelas->kelas ?? 'Kelas'),
                    'tingkat'       => $kelas->tingkat,
                    'kelas'         => $kelas->kelas,
                    'tahun_ajaran'  => $kelas->tahun_ajaran,
                    'deskripsi'     => $kelas->deskripsi,
                    'jumlah_siswa'  => $students->count(),
                    'students'      => $students,
                ];
            })
            ->sortBy(function ($kelas) {
                return strtolower($kelas['nama'] ?? '');
            }, SORT_REGULAR, false)
            ->values();

        return Inertia::render('Guru/Kelas/KelasPage', [
            'classes' => $classes,
        ]);
    }
}
