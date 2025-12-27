<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\BankMateri;
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
            ->with(['kelas', 'mataPelajaran', 'kelasMapel'])
            ->firstOrFail();

        $materiList = Materi::with(['kelas', 'mataPelajaran'])
            ->where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($materi) {
                $youtubeEmbedUrl = $this->buildYoutubeEmbedUrl($materi->youtube_url);

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
                    'youtube_url' => $materi->youtube_url,
                    'youtube_embed_url' => $youtubeEmbedUrl,
                    'video_name'  => $materi->video_name,
                    'video_mime'  => $materi->video_mime,
                    'video_size'  => $materi->video_size,
                    'video_url'   => $materi->video_path ? Storage::url($materi->video_path) : null,
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

        // Build kelas-mapel options from guru_kelas_mapel table
        $kelasMapelOptions = [];
        foreach ($guru->kelasMapel as $km) {
            $kelasId = $km->kelas_id;
            if (!isset($kelasMapelOptions[$kelasId])) {
                $kelasMapelOptions[$kelasId] = [];
            }
            $kelasMapelOptions[$kelasId][] = $km->mata_pelajaran_id;
        }

        // Get bank materis for the picker
        $bankMateris = BankMateri::where('guru_id', $guru->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'deskripsi' => $item->deskripsi,
                    'file_name' => $item->file_name,
                    'file_url' => $item->file_path ? Storage::url($item->file_path) : null,
                    'file_mime' => $item->file_mime,
                    'file_size' => $item->file_size,
                    'created_at' => $item->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Guru/Materi/MateriPage', [
            'materis'       => $materiList,
            'kelasOptions'  => $kelasOptions,
            'mapelOptions'  => $mapelOptions,
            'kelasMapelOptions' => $kelasMapelOptions,
            'bankMateris'   => $bankMateris,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();
        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $request->merge([
            'youtube_url' => $this->normalizeYoutubeInput($request->input('youtube_url')),
        ]);

        $validated = $request->validate([
            'judul'             => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'kelas_id'          => 'nullable|exists:kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
            'file'              => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,pps,ppsx,txt,zip,rar|max:20480',
            'video'             => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm|max:204800',
            'youtube_url'       => 'nullable|url|max:500',
            'remove_video'      => 'sometimes|boolean',
            'bank_materi_id'    => 'nullable|exists:bank_materis,id',
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
        } elseif (!empty($validated['bank_materi_id'])) {
            // Get file from bank materi
            $bankMateri = BankMateri::where('id', $validated['bank_materi_id'])
                ->where('guru_id', $guru->id)
                ->first();
                
            if ($bankMateri && $bankMateri->file_path) {
                $fileData = [
                    'file_path' => $bankMateri->file_path,
                    'file_name' => $bankMateri->file_name,
                    'file_mime' => $bankMateri->file_mime,
                    'file_size' => $bankMateri->file_size,
                ];
            }
        }

        $videoData = [
            'video_path' => null,
            'video_name' => null,
            'video_mime' => null,
            'video_size' => null,
        ];

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $storedVideoPath = $video->store("materi/{$guru->id}/video", 'public');

            $videoData = [
                'video_path' => $storedVideoPath,
                'video_name' => $video->getClientOriginalName(),
                'video_mime' => $video->getClientMimeType(),
                'video_size' => $video->getSize(),
            ];
        }

        Materi::create([
            'guru_id'           => $guru->id,
            'kelas_id'          => $kelasId,
            'mata_pelajaran_id' => isset($validated['mata_pelajaran_id'])
                ? (int) $validated['mata_pelajaran_id']
                : null,
            'judul'             => $validated['judul'],
            'deskripsi'         => $validated['deskripsi'] ?? null,
            'youtube_url'       => $validated['youtube_url'] ?? null,
            ...$fileData,
            ...$videoData,
        ]);

        return back()->with('success', 'Materi berhasil ditambahkan.');
    }

    public function update(Request $request, Materi $materi)
    {
        $user = auth()->user();
        $guru = $user->guru()->with('kelas')->firstOrFail();

        abort_if($materi->guru_id !== $guru->id, 403);

        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $request->merge([
            'youtube_url' => $this->normalizeYoutubeInput($request->input('youtube_url')),
        ]);

        $validated = $request->validate([
            'judul'             => 'required|string|max:255',
            'deskripsi'         => 'nullable|string',
            'kelas_id'          => 'nullable|exists:kelas,id',
            'mata_pelajaran_id' => 'nullable|exists:mata_pelajarans,id',
            'file'              => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,pps,ppsx,txt,zip,rar|max:20480',
            'video'             => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm|max:204800',
            'youtube_url'       => 'nullable|url|max:500',
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

        $videoData = [];
        $shouldRemoveVideo = $request->boolean('remove_video');

        if (($shouldRemoveVideo || $request->hasFile('video')) && $materi->video_path) {
            Storage::disk('public')->delete($materi->video_path);
        }

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $storedVideoPath = $video->store("materi/{$guru->id}/video", 'public');

            $videoData = [
                'video_path' => $storedVideoPath,
                'video_name' => $video->getClientOriginalName(),
                'video_mime' => $video->getClientMimeType(),
                'video_size' => $video->getSize(),
            ];
        } elseif ($shouldRemoveVideo) {
            $videoData = [
                'video_path' => null,
                'video_name' => null,
                'video_mime' => null,
                'video_size' => null,
            ];
        }

        $materi->update([
            'kelas_id'          => $kelasId,
            'mata_pelajaran_id' => isset($validated['mata_pelajaran_id'])
                ? (int) $validated['mata_pelajaran_id']
                : null,
            'judul'             => $validated['judul'],
            'deskripsi'         => $validated['deskripsi'] ?? null,
            'youtube_url'       => $validated['youtube_url'] ?? null,
            ...$fileData,
            ...$videoData,
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
        if ($materi->video_path) {
            Storage::disk('public')->delete($materi->video_path);
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

        $storage = Storage::disk('public');

        abort_unless($storage->exists($materi->file_path), 404);

        return response()->download(
            $storage->path($materi->file_path),
            $materi->file_name ?? basename($materi->file_path)
        );
    }

    private function normalizeYoutubeInput(?string $url): ?string
    {
        if ($url === null) {
            return null;
        }

        $trimmed = trim($url);

        return $trimmed === '' ? null : $trimmed;
    }

    private function buildYoutubeEmbedUrl(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        $trimmed = trim($url);
        if ($trimmed === '') {
            return null;
        }

        $patterns = [
            '/(?:youtube\\.com\\/(?:watch\\?v=|embed\\/|shorts\\/)|youtu\\.be\\/)([A-Za-z0-9_-]{11})/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $trimmed, $matches)) {
                return 'https://www.youtube.com/embed/' . $matches[1];
            }
        }

        parse_str(parse_url($trimmed, PHP_URL_QUERY) ?? '', $query);
        if (!empty($query['v']) && is_string($query['v'])) {
            return 'https://www.youtube.com/embed/' . $query['v'];
        }

        return null;
    }
}
