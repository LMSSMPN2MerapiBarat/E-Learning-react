<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MateriController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()
            ->with(['kelas', 'mataPelajaran'])
            ->firstOrFail();

        $materiList = Materi::with(['kelas', 'mataPelajaran'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($materi) {
                return [
                    'id'          => $materi->id,
                    'judul'       => $materi->judul,
                    'deskripsi'   => $materi->deskripsi,
                    'kelas_id'    => $materi->kelas_id,
                    'kelas'       => $materi->kelas ? [
                        'id'      => $materi->kelas->id,
                        'nama'    => trim(($materi->kelas->tingkat ?? '') . ' ' . ($materi->kelas->kelas ?? '')),
                        'tingkat' => $materi->kelas->tingkat,
                    ] : null,
                    'mata_pelajaran_id' => $materi->mata_pelajaran_id,
                    'mapel'       => $materi->mataPelajaran ? [
                        'id'   => $materi->mata_pelajaran_id,
                        'nama' => $materi->mataPelajaran->nama_mapel,
                    ] : null,
                    'file_name'   => $materi->file_name,
                    'file_url'    => $materi->file_path ? Storage::url($materi->file_path) : null,
                    'file_mime'   => $materi->file_mime,
                    'file_size'   => $materi->file_size,
                    'created_at'  => $materi->created_at?->toIso8601String(),
                ];
            });

        $kelasOptions = $guru->kelas->map(function ($kelas) {
            $nama = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
            return [
                'id'   => $kelas->id,
                'nama' => $nama !== '' ? $nama : ($kelas->kelas ?? null),
            ];
        })->filter(fn($item) => !empty($item['nama']))->values();

        $mapelOptions = $guru->mataPelajaran->map(function ($mapel) {
            return [
                'id'   => $mapel->id,
                'nama' => $mapel->nama_mapel,
            ];
        })->filter(fn($item) => !empty($item['nama']))->values();

        return Inertia::render('Guru/Materi/MateriPage', [
            'materis'       => $materiList,
            'kelasOptions'  => $kelasOptions,
            'mapelOptions'  => $mapelOptions,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();
        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $validated = $request->validate([
            'judul'             => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'kelas_id'          => 'nullable|exists:kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
            'file'              => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,txt,zip,rar|max:10240',
        ]);

        $kelasId = $validated['kelas_id'] !== null ? (int) $validated['kelas_id'] : null;

        if ($kelasId !== null && !in_array($kelasId, $allowedKelasIds, true)) {
            abort(403, 'Anda tidak memiliki akses ke kelas tersebut.');
        }

        $fileData = [
            'file_path' => null,
            'file_name' => null,
            'file_mime' => null,
            'file_size' => null,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $storedPath = $file->store("materi/{$guru->id}", 'public');

            $fileData = [
                'file_path' => $storedPath,
                'file_name' => $file->getClientOriginalName(),
                'file_mime' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ];
        }

        Materi::create([
            'guru_id'           => $guru->id,
            'kelas_id'          => $kelasId,
            'mata_pelajaran_id' => $validated['mata_pelajaran_id'] ?? null,
            'judul'             => $validated['judul'],
            'deskripsi'         => $validated['deskripsi'] ?? null,
            ...$fileData,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan.');
    }

    public function update(Request $request, Materi $materi)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();

        abort_if($materi->guru_id !== $guru->id, 403);

        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $validated = $request->validate([
            'judul'             => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'kelas_id'          => 'nullable|exists:kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
            'file'              => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,txt,zip,rar|max:10240',
        ]);

        $kelasId = $validated['kelas_id'] !== null ? (int) $validated['kelas_id'] : null;

        if ($kelasId !== null && !in_array($kelasId, $allowedKelasIds, true)) {
            abort(403, 'Anda tidak memiliki akses ke kelas tersebut.');
        }

        $fileData = [];

        if ($request->hasFile('file')) {
            if ($materi->file_path) {
                Storage::disk('public')->delete($materi->file_path);
            }

            $file = $request->file('file');
            $storedPath = $file->store("materi/{$guru->id}", 'public');

            $fileData = [
                'file_path' => $storedPath,
                'file_name' => $file->getClientOriginalName(),
                'file_mime' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ];
        }

        $materi->update([
            'kelas_id'          => $kelasId,
            'mata_pelajaran_id' => $validated['mata_pelajaran_id'] ?? null,
            'judul'             => $validated['judul'],
            'deskripsi'         => $validated['deskripsi'] ?? null,
            ...$fileData,
        ]);

        return back()->with('success', 'Materi berhasil diperbarui.');
    }

    public function destroy(Materi $materi)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        abort_if($materi->guru_id !== $guru->id, 403);

        if ($materi->file_path) {
            Storage::disk('public')->delete($materi->file_path);
        }

        $materi->delete();

        return back()->with('success', 'Materi berhasil dihapus.');
    }

    public function download(Materi $materi)
    {
        $user = auth()->user();
        $guru = $user->guru()->first();

        abort_if(!$guru || $materi->guru_id !== $guru->id, 403);
        abort_if(!$materi->file_path, 404);

        return Storage::disk('public')->download(
            $materi->file_path,
            $materi->file_name ?? basename($materi->file_path)
        );
    }
}
