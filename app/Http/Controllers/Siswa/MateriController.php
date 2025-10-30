<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Materi;
use Illuminate\Support\Facades\Storage;

class MateriController extends Controller
{
    public function preview(Materi $materi)
    {
        $this->authorizeAccess($materi);

        if (!$materi->file_path || !Storage::disk('public')->exists($materi->file_path)) {
            abort(404, 'File materi tidak ditemukan.');
        }

        $fileName = $materi->file_name ?? basename($materi->file_path);
        $mimeType = Storage::disk('public')->mimeType($materi->file_path) ?? 'application/octet-stream';

        return Storage::disk('public')->response(
            $materi->file_path,
            $fileName,
            [
                'Content-Type' => $mimeType,
                'Content-Disposition' => sprintf('inline; filename="%s"', $fileName),
            ]
        );
    }

    public function download(Materi $materi)
    {
        $this->authorizeAccess($materi);

        if (!$materi->file_path || !Storage::disk('public')->exists($materi->file_path)) {
            abort(404, 'File materi tidak ditemukan.');
        }

        $fileName = $materi->file_name ?? basename($materi->file_path);

        return Storage::disk('public')->download($materi->file_path, $fileName);
    }

    protected function authorizeAccess(Materi $materi): void
    {
        $user = auth()->user();
        $siswa = $user->siswa()->with('kelas')->first();

        abort_if(!$siswa, 403, 'Profil siswa tidak ditemukan.');

        $kelasId = $materi->kelas_id;

        if ($kelasId && $siswa->kelas_id !== $kelasId) {
            abort(403, 'Anda tidak memiliki akses ke materi ini.');
        }
    }
}
