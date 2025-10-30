<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Guru;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminGuruController extends Controller
{
    public function index()
    {
        $gurus = Guru::with(['user', 'mataPelajaran', 'kelas'])
            ->get()
            ->map(function ($g) {
                $mapelList = $g->mataPelajaran
                    ->pluck('nama_mapel')
                    ->filter()
                    ->values();

                $kelasList = $g->kelas
                    ->map(function ($kelas) {
                        $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
                        return $nama !== '' ? $nama : ($kelas->kelas ?? null);
                    })
                    ->filter()
                    ->unique()
                    ->values();

                return [
                    'id'       => $g->id,
                    'name'     => $g->user->name,
                    'email'    => $g->user->email,
                    'nip'      => $g->nip,
                    'mapel'    => $mapelList->implode(', '),
                    'mapel_ids' => $g->mataPelajaran->pluck('id')->all(),
                    'kelas'    => $kelasList->implode(', '),
                    'kelas_ids' => $g->kelas->pluck('id')->all(),
                    'no_telp'  => $g->no_telp,
                ];
            });

        $mapels = MataPelajaran::all(['id', 'nama_mapel']);

        return Inertia::render('admin/Guru/Guru', [
            'gurus'  => $gurus,
            'mapels' => $mapels,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|min:6',
            'nip'       => 'nullable|string|max:20',
            'mapel_ids' => 'nullable|array',
            'no_telp'   => 'nullable|string|max:20',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
            'mapel_ids.*' => 'exists:mata_pelajarans,id',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => 'guru',
        ]);

        $guru = Guru::create([
            'user_id' => $user->id,
            'nip'     => $validated['nip'] ?? null,
            'no_telp' => $validated['no_telp'] ?? null,
        ]);

        $guru->mataPelajaran()->sync($validated['mapel_ids'] ?? []);
        $guru->kelas()->sync($validated['kelas_ids'] ?? []);

        return back()->with('success', 'Guru berhasil ditambahkan!');
    }

    public function update(Request $request, Guru $guru)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $guru->user->id,
            'nip'       => 'nullable|string|max:20',
            'no_telp'   => 'nullable|string|max:20',
            'mapel_ids' => 'nullable|array',
            'mapel_ids.*' => 'exists:mata_pelajarans,id',
            'kelas_ids' => 'nullable|array',
            'kelas_ids.*' => 'exists:kelas,id',
        ]);

        $guru->user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
        ]);

        $guru->update([
            'nip'     => $validated['nip'] ?? null,
            'no_telp' => $validated['no_telp'] ?? null,
        ]);

        $guru->mataPelajaran()->sync($validated['mapel_ids'] ?? []);
        $guru->kelas()->sync($validated['kelas_ids'] ?? []);

        return back()->with('success', 'Data guru berhasil diperbarui!');
    }

    public function destroy(Guru $guru)
    {
        if ($guru->user) {
            $guru->user->delete();
        }
        $guru->delete();

        return back()->with('success', 'Guru beserta akunnya berhasil dihapus!');
    }

    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (empty($ids)) {
            return back()->with('error', 'Tidak ada guru yang dipilih untuk dihapus.');
        }

        $gurus = Guru::whereIn('id', $ids)->with('user')->get();

        foreach ($gurus as $guru) {
            if ($guru->user) {
                $guru->user->delete();
            }
            $guru->delete();
        }

        return back()->with('success', '✅ Beberapa guru berhasil dihapus beserta akunnya.');
    }
}
