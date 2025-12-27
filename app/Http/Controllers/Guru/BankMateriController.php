<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\BankMateri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BankMateriController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

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
                    'status' => $item->status,
                    'created_at' => $item->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('Guru/BankMateri/BankMateriPage', [
            'bankMateris' => $bankMateris,
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:published,draft',
            'file' => 'required|file|mimes:pdf,doc,docx,ppt,pptx,pps,ppsx|max:20480',
        ]);

        $file = $request->file('file');
        $storedPath = $file->store("bank-materi/{$guru->id}", 'public');

        BankMateri::create([
            'guru_id' => $guru->id,
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => $validated['status'],
            'file_path' => $storedPath,
            'file_name' => $file->getClientOriginalName(),
            'file_mime' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return back()->with('success', 'File berhasil ditambahkan ke Bank Materi.');
    }

    public function update(Request $request, BankMateri $bankMateri)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        abort_if($bankMateri->guru_id !== $guru->id, 403);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'status' => 'required|in:published,draft',
            'file' => 'nullable|file|mimes:pdf,doc,docx,ppt,pptx,pps,ppsx|max:20480',
        ]);

        $fileData = [];

        if ($request->hasFile('file')) {
            // Delete old file
            if ($bankMateri->file_path) {
                Storage::disk('public')->delete($bankMateri->file_path);
            }

            $file = $request->file('file');
            $storedPath = $file->store("bank-materi/{$guru->id}", 'public');

            $fileData = [
                'file_path' => $storedPath,
                'file_name' => $file->getClientOriginalName(),
                'file_mime' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ];
        }

        $bankMateri->update([
            'nama' => $validated['nama'],
            'deskripsi' => $validated['deskripsi'] ?? null,
            'status' => $validated['status'],
            ...$fileData,
        ]);

        return back()->with('success', 'File berhasil diperbarui.');
    }

    public function destroy(BankMateri $bankMateri)
    {
        $user = auth()->user();
        $guru = $user->guru()->firstOrFail();

        abort_if($bankMateri->guru_id !== $guru->id, 403);

        if ($bankMateri->file_path) {
            Storage::disk('public')->delete($bankMateri->file_path);
        }

        $bankMateri->delete();

        return back()->with('success', 'File berhasil dihapus dari Bank Materi.');
    }

    public function download(BankMateri $bankMateri)
    {
        $user = auth()->user();
        $guru = $user->guru()->first();

        abort_if(!$guru || $bankMateri->guru_id !== $guru->id, 403);
        abort_if(!$bankMateri->file_path, 404);

        $storage = Storage::disk('public');
        abort_unless($storage->exists($bankMateri->file_path), 404);

        return response()->download(
            $storage->path($bankMateri->file_path),
            $bankMateri->file_name ?? basename($bankMateri->file_path)
        );
    }
}
