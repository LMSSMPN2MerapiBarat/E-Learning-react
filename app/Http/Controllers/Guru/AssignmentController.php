<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentAttachment;
use App\Models\AssignmentSubmission;
use App\Models\AssignmentSubmissionFile;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Siswa;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AssignmentSubmissionsExport;

class AssignmentController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        /** @var Guru $guru */
        $guru = $user->guru()->with(['kelas', 'mataPelajaran', 'kelasMapel'])->firstOrFail();

        $assignments = Assignment::with([
                'kelas',
                'attachments',
                'mataPelajaran',
                'submissions.siswa.user',
                'submissions.siswa.kelas',
                'submissions.files',
            ])
            ->where('guru_id', $guru->id)
            ->latest('ditutup_pada')
            ->get()
            ->map(fn(Assignment $assignment) => $this->formatAssignmentPayload($assignment));

        $kelasOptions = $guru->kelas
            ->map(fn($kelas) => [
                'id' => $kelas->id,
                'nama' => $this->formatClassLabel($kelas),
            ])
            ->filter(fn($kelas) => !empty($kelas['nama']))
            ->values();

        $mapelOptions = $guru->mataPelajaran
            ->map(fn($mapel) => [
                'id' => $mapel->id,
                'nama' => $mapel->nama_mapel,
            ])
            ->filter(fn($mapel) => !empty($mapel['nama']))
            ->values();

        // Build kelas-mapel options from guru_kelas_mapel table
        $kelasMapelOptions = [];
        foreach ($guru->kelasMapel as $km) {
            $kelasId = $km->kelas_id;
            if (!isset($kelasMapelOptions[$kelasId])) {
                $kelasMapelOptions[$kelasId] = [];
            }
            $kelasMapelOptions[$kelasId][] = $km->mata_pelajaran_id;
        }

        return Inertia::render('Guru/Tugas/TugasPage', [
            'assignments' => $assignments,
            'kelasOptions' => $kelasOptions,
            'mapelOptions' => $mapelOptions,
            'kelasMapelOptions' => $kelasMapelOptions,
            'fileTypeOptions' => $this->defaultAllowedFileTypes(),
        ]);
    }

    public function show(Assignment $assignment)
    {
        $guru = $this->resolveGuruWithKelas();

        abort_if($assignment->guru_id !== $guru->id, 403);

        $assignment->loadMissing([
            'kelas',
            'attachments',
            'mataPelajaran',
            'submissions.siswa.user',
            'submissions.siswa.kelas',
            'submissions.files',
        ]);

        return Inertia::render('Guru/Tugas/Detail', [
            'assignment' => $this->formatAssignmentPayload($assignment),
        ]);
    }

    public function exportGrades(Request $request, Assignment $assignment)
    {
        $guru = $this->resolveGuruWithKelas();

        abort_if($assignment->guru_id !== $guru->id, 403);

        // Get class IDs from query parameter
        $kelasIds = $request->query('kelas_ids', []);
        if (is_string($kelasIds)) {
            $kelasIds = explode(',', $kelasIds);
        }
        $kelasIds = array_map('intval', array_filter($kelasIds));

        // If no classes selected, export all
        if (empty($kelasIds)) {
            $kelasIds = $assignment->kelas->pluck('id')->all();
        }

        // Single class: return single Excel
        if (count($kelasIds) === 1) {
            $kelas = Kelas::find($kelasIds[0]);
            $kelasLabel = $kelas ? trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? '')) : '';
            $filename = 'nilai-tugas-' . $assignment->judul . ($kelasLabel ? '-' . $kelasLabel : '') . '.xlsx';

            return Excel::download(
                new AssignmentSubmissionsExport($assignment->id, $kelasIds),
                $filename
            );
        }

        // Multiple classes: create ZIP with separate Excel files
        $zipFileName = 'nilai-tugas-' . $assignment->judul . '.zip';
        $tempDir = storage_path('app/temp');
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        $zipPath = $tempDir . '/' . uniqid() . '.zip';

        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($kelasIds as $kelasId) {
            $kelas = Kelas::find($kelasId);
            if (!$kelas) continue;

            $kelasLabel = trim(($kelas->tingkat ?? '') . ' ' . ($kelas->kelas ?? ''));
            $excelFileName = 'nilai-tugas-' . $assignment->judul . '-' . $kelasLabel . '.xlsx';

            // Generate Excel content directly and add to ZIP
            $excelContent = Excel::raw(
                new AssignmentSubmissionsExport($assignment->id, [$kelasId]),
                \Maatwebsite\Excel\Excel::XLSX
            );

            $zip->addFromString($excelFileName, $excelContent);
        }

        $zip->close();

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    public function store(Request $request)
    {
        $guru = $this->resolveGuruWithKelas();

        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $validated = $this->validatePayload($request, $allowedKelasIds);

        DB::transaction(function () use ($validated, $guru, $request) {
            $assignment = Assignment::create([
                'guru_id' => $guru->id,
                'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                'judul' => $validated['title'],
                'deskripsi' => $validated['description'] ?? null,
                'dibuka_pada' => Carbon::parse($validated['open_at']),
                'ditutup_pada' => Carbon::parse($validated['close_at']),
                'max_score' => (int) $validated['max_score'],
                'passing_grade' => $validated['passing_grade'],
                'allow_text_answer' => $validated['allow_text_answer'],
                'allow_file_upload' => $validated['allow_file_upload'],
                'allowed_file_types' => $validated['allowed_file_types'],
                'allow_cancel_submit' => $validated['allow_cancel_submit'],
                'status' => $validated['status'],
            ]);

            $assignment->kelas()->sync($validated['kelas_ids']);

            $this->handleAttachmentUploads($assignment, $request);
        });

        return back()->with('success', 'Tugas berhasil dibuat.');
    }

    public function update(Request $request, Assignment $assignment)
    {
        $guru = $this->resolveGuruWithKelas();

        abort_if($assignment->guru_id !== $guru->id, 403);

        $allowedKelasIds = $guru->kelas->pluck('id')->all();

        $validated = $this->validatePayload($request, $allowedKelasIds, $assignment);

        DB::transaction(function () use ($validated, $assignment, $request) {
            $assignment->update([
                'mata_pelajaran_id' => $validated['mata_pelajaran_id'],
                'judul' => $validated['title'],
                'deskripsi' => $validated['description'] ?? null,
                'dibuka_pada' => Carbon::parse($validated['open_at']),
                'ditutup_pada' => Carbon::parse($validated['close_at']),
                'max_score' => (int) $validated['max_score'],
                'passing_grade' => $validated['passing_grade'],
                'allow_text_answer' => $validated['allow_text_answer'],
                'allow_file_upload' => $validated['allow_file_upload'],
                'allowed_file_types' => $validated['allowed_file_types'],
                'allow_cancel_submit' => $validated['allow_cancel_submit'],
                'status' => $validated['status'],
            ]);

            $assignment->kelas()->sync($validated['kelas_ids']);

            $this->removeMarkedAttachments($assignment, $request->input('removed_attachment_ids', []));
            $this->handleAttachmentUploads($assignment, $request);
        });

        return back()->with('success', 'Tugas berhasil diperbarui.');
    }

    public function destroy(Assignment $assignment)
    {
        $guru = $this->resolveGuruWithKelas();

        abort_if($assignment->guru_id !== $guru->id, 403);

        DB::transaction(function () use ($assignment) {
            $this->purgeAttachments($assignment->attachments);

            $assignment->submissions()->each(function (AssignmentSubmission $submission) {
                $this->purgeSubmissionFiles($submission->files);
                $submission->delete();
            });

            $assignment->delete();
        });

        return back()->with('success', 'Tugas berhasil dihapus.');
    }

    protected function validatePayload(Request $request, array $allowedKelasIds, ?Assignment $assignment = null): array
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'mata_pelajaran_id' => [
                'nullable',
                'integer',
                'exists:mata_pelajarans,id',
            ],
            'kelas_ids' => ['required', 'array', 'min:1'],
            'kelas_ids.*' => ['integer', 'exists:kelas,id'],
            'open_at' => 'required|date',
            'close_at' => 'required|date|after:open_at',
            'max_score' => 'required|integer|min:1|max:1000',
            'passing_grade' => 'nullable|integer|min:0',
            'allow_text_answer' => 'required|boolean',
            'allow_file_upload' => 'required|boolean',
            'allowed_file_types' => 'nullable|array',
            'allowed_file_types.*' => 'string|max:12',
            'allow_cancel_submit' => 'required|boolean',
            'status' => [
                'required',
                Rule::in(['draft', 'active']),
            ],
        ]);

        $data['kelas_ids'] = array_map(
            static fn($kelasId) => (int) $kelasId,
            $data['kelas_ids'],
        );

        foreach ($data['kelas_ids'] as $kelasId) {
            if (!in_array($kelasId, $allowedKelasIds, true)) {
                abort(403, 'Anda tidak memiliki akses untuk kelas yang dipilih.');
            }
        }

        if (isset($data['passing_grade']) && $data['passing_grade'] > $data['max_score']) {
            throw ValidationException::withMessages([
                'passing_grade' => 'Passing grade tidak boleh melebihi skor maksimal.',
            ]);
        }

        if (!$data['allow_text_answer'] && !$data['allow_file_upload']) {
            throw ValidationException::withMessages([
                'submission' => 'Aktifkan minimal satu metode pengumpulan.',
            ]);
        }

        $data['allowed_file_types'] = $this->normalizeFileTypes(
            $data['allowed_file_types'] ?? $this->defaultAllowedFileTypes()
        );

        $data['mata_pelajaran_id'] = $data['mata_pelajaran_id'] ?? null;

        return $data;
    }

    protected function handleAttachmentUploads(Assignment $assignment, Request $request): void
    {
        if (!$request->hasFile('attachments')) {
            return;
        }

        foreach ((array) $request->file('attachments') as $file) {
            if (!$file) {
                continue;
            }

            $storedPath = $file->store("assignments/{$assignment->guru_id}/references", 'public');

            AssignmentAttachment::create([
                'assignment_id' => $assignment->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $storedPath,
                'file_mime' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }
    }

    protected function removeMarkedAttachments(Assignment $assignment, array $attachmentIds): void
    {
        if (empty($attachmentIds)) {
            return;
        }

        $attachments = $assignment->attachments()
            ->whereIn('id', $attachmentIds)
            ->get();

        $this->purgeAttachments($attachments);
    }

    protected function purgeAttachments(EloquentCollection $attachments): void
    {
        $attachments->each(function (AssignmentAttachment $attachment) {
            if ($attachment->file_path) {
                Storage::disk('public')->delete($attachment->file_path);
            }

            $attachment->delete();
        });
    }

    protected function purgeSubmissionFiles(EloquentCollection $files): void
    {
        $files->each(function (AssignmentSubmissionFile $file) {
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }

            $file->delete();
        });
    }

    protected function formatAssignmentPayload(Assignment $assignment): array
    {
        $classLabels = $assignment->kelas->map(function (Kelas $kelas) {
            return [
                'id' => $kelas->id,
                'nama' => $this->formatClassLabel($kelas),
            ];
        })->filter(fn($kelas) => !empty($kelas['nama']))->values();

        $classIds = $assignment->kelas->pluck('id')->values();

        $totalStudents = Siswa::whereIn('kelas_id', $classIds)->count();
        $submittedCount = $assignment->submissions
            ->whereIn('status', ['submitted', 'graded'])
            ->count();
        $needsGrading = $assignment->submissions
            ->where('status', 'submitted')
            ->count();
        $gradedCount = $assignment->submissions
            ->where('status', 'graded')
            ->count();

        return [
            'id' => $assignment->id,
            'title' => $assignment->judul,
            'description' => $assignment->deskripsi,
            'status' => $this->resolveAssignmentStatus($assignment),
            'openDate' => $assignment->dibuka_pada?->toIso8601String(),
            'closeDate' => $assignment->ditutup_pada?->toIso8601String(),
            'maxScore' => $assignment->max_score,
            'passingGrade' => $assignment->passing_grade,
            'allowTextAnswer' => (bool) $assignment->allow_text_answer,
            'allowFileUpload' => (bool) $assignment->allow_file_upload,
            'allowedFileTypes' => $assignment->allowed_file_types ?? $this->defaultAllowedFileTypes(),
            'allowCancelSubmit' => (bool) $assignment->allow_cancel_submit,
            'kelas' => $classLabels,
            'kelasIds' => $classIds,
            'attachments' => $assignment->attachments
                ->map(fn(AssignmentAttachment $attachment) => [
                    'id' => $attachment->id,
                    'name' => $attachment->file_name,
                    'url' => $attachment->file_path ? Storage::url($attachment->file_path) : null,
                    'mime' => $attachment->file_mime,
                    'size' => $attachment->file_size,
                ])
                ->values(),
            'mapel' => $assignment->mataPelajaran ? [
                'id' => $assignment->mata_pelajaran_id,
                'nama' => $assignment->mataPelajaran->nama_mapel,
            ] : null,
            'submissions' => $assignment->submissions
                ->map(fn(AssignmentSubmission $submission) => $this->formatSubmissionPayload($submission, $assignment->max_score))
                ->values(),
            'stats' => [
                'totalStudents' => $totalStudents,
                'submitted' => $submittedCount,
                'needsGrading' => $needsGrading,
                'graded' => $gradedCount,
            ],
        ];
    }

    protected function formatSubmissionPayload(AssignmentSubmission $submission, int $maxScore): array
    {
        $siswa = $submission->siswa;
        $studentName = $siswa?->user?->name ?? 'Siswa';

        return [
            'id' => $submission->id,
            'assignmentId' => $submission->assignment_id,
            'studentId' => $submission->siswa_id,
            'studentName' => $studentName,
            'studentClass' => $siswa && $siswa->kelas
                ? $this->formatClassLabel($siswa->kelas)
                : null,
            'status' => $submission->status,
            'submittedAt' => $submission->submitted_at?->toIso8601String(),
            'gradedAt' => $submission->graded_at?->toIso8601String(),
            'score' => $submission->score,
            'maxScore' => $maxScore,
            'feedback' => $submission->feedback,
            'textAnswer' => $submission->text_answer,
            'files' => $submission->files
                ->map(function (AssignmentSubmissionFile $file) {
                    return [
                        'id' => $file->id,
                        'name' => $file->file_name,
                        'url' => $file->file_path ? Storage::url($file->file_path) : null,
                        'size' => $file->file_size,
                        'mime' => $file->file_mime,
                    ];
                })
                ->values(),
        ];
    }

    protected function resolveAssignmentStatus(Assignment $assignment): string
    {
        if ($assignment->status === 'draft') {
            return 'draft';
        }

        if ($assignment->ditutup_pada && $assignment->ditutup_pada->isPast()) {
            return 'closed';
        }

        return $assignment->status;
    }

    protected function formatClassLabel(?Kelas $kelas): ?string
    {
        if (!$kelas) {
            return null;
        }

        $parts = array_filter([$kelas->tingkat, $kelas->kelas]);
        $label = trim(implode(' ', $parts));

        return $label !== '' ? $label : null;
    }

    protected function normalizeFileTypes(array $types): array
    {
        return collect($types)
            ->filter()
            ->map(function ($value) {
                $trimmed = strtolower(trim($value));
                if ($trimmed === '') {
                    return null;
                }
                return str_starts_with($trimmed, '.') ? $trimmed : ".{$trimmed}";
            })
            ->filter()
            ->values()
            ->all();
    }

    protected function resolveGuruWithKelas(): Guru
    {
        return auth()->user()
            ->guru()
            ->with('kelas')
            ->firstOrFail();
    }

    protected function defaultAllowedFileTypes(): array
    {
        return ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png'];
    }
}
