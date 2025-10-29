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
        $gurus = Guru::with(['user', 'mataPelajaran'])
            ->get()
            ->map(function ($g) {
                return [
                    'id'       => $g->id,
                    'name'     => $g->user->name,
                    'email'    => $g->user->email,
                    'nip'      => $g->nip,
                    'mapel'    => $g->mataPelajaran->pluck('nama_mapel')->join(', '),
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

        if (!empty($validated['mapel_ids'])) {
            $guru->mataPelajaran()->sync($validated['mapel_ids']);
        }

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
