<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\AssignmentSubmission;
use App\Models\AssignmentSubmissionFile;
use App\Models\Kelas;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Services\StudentNotificationService;

class AssignmentController extends Controller
{
    public function __construct(
        protected StudentNotificationService $studentNotificationService,
    ) {
    }

    public function index()
    {
        $user = auth()->user();
        $siswa = $user->siswa()->with('kelas')->firstOrFail();
        $kelas = $siswa->kelas;

        $assignments = collect();

        if ($kelas) {
            $assignments = Assignment::with([
                    'attachments',
                    'mataPelajaran',
                    'guru.user',
                    'kelas',
                    'submissions' => function ($query) use ($siswa) {
                        $query
                            ->where('siswa_id', $siswa->id)
                            ->with('files');
                    },
                ])
                ->where('status', '!=', 'draft')
                ->whereHas('kelas', fn($query) => $query->where('kelas.id', $kelas->id))
                ->orderBy('ditutup_pada')
                ->get();
        }

        $assignmentPayload = $assignments
            ->map(fn(Assignment $assignment) => $this->formatStudentAssignment($assignment, $siswa))
            ->values();

        $notifications = $this->studentNotificationService->build(
            $siswa,
            $kelas,
            fn($kelasModel) => $this->formatClassLabel($kelasModel),
            null,
            null,
            $assignments,
        );

        return Inertia::render('Siswa/Tugas/TugasPage', [
            'student' => [
                'name' => $user->name,
                'className' => $this->formatClassLabel($kelas),
            ],
            'hasClass' => (bool) $kelas,
            'assignments' => $assignmentPayload,
            'notifications' => $notifications,
        ]);
    }

    public function saveDraft(Request $request, Assignment $assignment)
    {
        $siswa = $this->resolveStudent();
        $assignment = $this->ensureAssignmentAccessible($assignment, $siswa);

        $existingSubmission = AssignmentSubmission::with('files')
            ->where('assignment_id', $assignment->id)
            ->where('siswa_id', $siswa->id)
            ->first();

        $payload = $this->validateSubmissionPayload($request, $assignment, false, $existingSubmission);

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'siswa_id' => $siswa->id,
            ],
            [
                'status' => 'draft',
            ]
        );

        $submission->text_answer = $payload['text_answer'];
        $submission->status = 'draft';
        $submission->submitted_at = null;
        $submission->graded_at = null;
        $submission->score = null;
        $submission->feedback = null;
        $submission->save();

        if ($request->hasFile('files')) {
            $this->replaceSubmissionFiles($submission, $assignment, $request);
        }

        return back()->with('success', 'Draft tugas berhasil disimpan.');
    }

    public function submit(Request $request, Assignment $assignment)
    {
        $siswa = $this->resolveStudent();
        $assignment = $this->ensureAssignmentAccessible($assignment, $siswa, true);

        if ($assignment->ditutup_pada && $assignment->ditutup_pada->isPast()) {
            abort(403, 'Batas waktu pengumpulan telah berakhir.');
        }

        $existingSubmission = AssignmentSubmission::with('files')
            ->where('assignment_id', $assignment->id)
            ->where('siswa_id', $siswa->id)
            ->first();

        $payload = $this->validateSubmissionPayload($request, $assignment, true, $existingSubmission);

        $submission = AssignmentSubmission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'siswa_id' => $siswa->id,
            ],
            []
        );

        $submission->text_answer = $payload['text_answer'];
        $submission->status = 'submitted';
        $submission->submitted_at = now();
        $submission->graded_at = null;
        $submission->score = null;
        $submission->feedback = null;
        $submission->save();

        if ($request->hasFile('files')) {
            $this->replaceSubmissionFiles($submission, $assignment, $request);
        }

        return back()->with('success', 'Tugas berhasil dikumpulkan.');
    }

    public function cancel(Request $request, Assignment $assignment)
    {
        $siswa = $this->resolveStudent();
        $assignment = $this->ensureAssignmentAccessible($assignment, $siswa);

        abort_if(!$assignment->allow_cancel_submit, 403, 'Tugas ini tidak mengizinkan pembatalan submit.');

        if ($assignment->ditutup_pada && $assignment->ditutup_pada->isPast()) {
            abort(403, 'Tugas sudah ditutup.');
        }

        $submission = AssignmentSubmission::where('assignment_id', $assignment->id)
            ->where('siswa_id', $siswa->id)
            ->firstOrFail();

        abort_if($submission->status !== 'submitted', 422, 'Tidak ada pengumpulan yang bisa dibatalkan.');

        $submission->update([
            'status' => 'draft',
            'submitted_at' => null,
            'graded_at' => null,
            'score' => null,
            'feedback' => null,
        ]);

        return back()->with('success', 'Pengumpulan berhasil dibatalkan.');
    }

    protected function validateSubmissionPayload(
        Request $request,
        Assignment $assignment,
        bool $requireAnswer,
        ?AssignmentSubmission $existingSubmission = null
    ): array {
        $data = $request->validate([
            'text_answer' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'file|max:51200',
        ]);

        if (!$assignment->allow_file_upload && $request->hasFile('files')) {
            throw ValidationException::withMessages([
                'files' => 'Tugas ini tidak mengizinkan unggah file.',
            ]);
        }

        $allowedExtensions = collect($assignment->allowed_file_types ?? $this->defaultAllowedFileTypes())
            ->map(fn($ext) => ltrim(strtolower($ext), '.'))
            ->filter()
            ->values()
            ->all();

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                if (!$file) {
                    continue;
                }
                $ext = strtolower($file->getClientOriginalExtension());
                if (!in_array($ext, $allowedExtensions, true)) {
                    throw ValidationException::withMessages([
                        'files' => "Tipe file .{$ext} tidak diizinkan.",
                    ]);
                }
            }
        }

        if ($requireAnswer) {
            $hasText = $assignment->allow_text_answer
                && trim((string) ($data['text_answer'] ?? '')) !== '';

            $existingText = $assignment->allow_text_answer
                && $existingSubmission
                && trim((string) $existingSubmission->text_answer) !== '';

            $incomingFiles = $assignment->allow_file_upload
                && $request->hasFile('files')
                && count($request->file('files')) > 0;

            $existingFiles = $assignment->allow_file_upload
                && $existingSubmission
                && $existingSubmission->files
                && $existingSubmission->files->count() > 0;

            if (!$hasText && !$existingText && !$incomingFiles && !$existingFiles) {
                throw ValidationException::withMessages([
                    'text_answer' => 'Isi jawaban teks atau unggah file sesuai instruksi tugas.',
                ]);
            }
        }

        return [
            'text_answer' => $assignment->allow_text_answer ? ($data['text_answer'] ?? null) : null,
        ];
    }

    protected function replaceSubmissionFiles(AssignmentSubmission $submission, Assignment $assignment, Request $request): void
    {
        if (!$assignment->allow_file_upload || !$request->hasFile('files')) {
            return;
        }

        $existingFiles = $submission->files()->get();
        $this->purgeSubmissionFiles($existingFiles);

        foreach ((array) $request->file('files') as $file) {
            if (!$file) {
                continue;
            }

            $storedPath = $file->store(
                "assignments/{$assignment->id}/submissions/{$submission->siswa_id}",
                'public'
            );

            AssignmentSubmissionFile::create([
                'assignment_submission_id' => $submission->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $storedPath,
                'file_mime' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
            ]);
        }
    }

    protected function formatStudentAssignment(Assignment $assignment, Siswa $siswa): array
    {
        $submission = $assignment->submissions->first();
        $now = now();

        $status = 'pending';

        if ($submission) {
            if ($submission->status === 'graded') {
                $status = 'graded';
            } elseif ($submission->status === 'submitted') {
                $status = 'submitted';
            }
        }

        if ($status === 'pending' && $assignment->ditutup_pada && $assignment->ditutup_pada->isPast()) {
            $status = 'late';
        }

        return [
            'id' => $assignment->id,
            'title' => $assignment->judul,
            'description' => $assignment->deskripsi,
            'subject' => $assignment->mataPelajaran?->nama_mapel,
            'teacher' => $assignment->guru?->user?->name,
            'classes' => $assignment->kelas->map(fn($kelas) => $this->formatClassLabel($kelas))->filter()->values(),
            'openDate' => $assignment->dibuka_pada?->toIso8601String(),
            'closeDate' => $assignment->ditutup_pada?->toIso8601String(),
            'maxScore' => $assignment->max_score,
            'passingGrade' => $assignment->passing_grade,
            'allowTextAnswer' => (bool) $assignment->allow_text_answer,
            'allowFileUpload' => (bool) $assignment->allow_file_upload,
            'allowedFileTypes' => $assignment->allowed_file_types ?? $this->defaultAllowedFileTypes(),
            'allowCancelSubmit' => (bool) $assignment->allow_cancel_submit,
            'attachments' => $assignment->attachments
                ->map(fn($attachment) => [
                    'id' => $attachment->id,
                    'name' => $attachment->file_name,
                    'url' => $attachment->file_path ? Storage::url($attachment->file_path) : null,
                ])
                ->values(),
            'status' => $status,
            'submittedDate' => $submission?->submitted_at?->toDateString(),
            'score' => $submission?->score,
            'feedback' => $submission?->feedback,
            'textAnswer' => $submission?->text_answer,
            'submissionId' => $submission?->id,
            'files' => $submission?->files
                ? $submission->files->map(fn($file) => [
                    'id' => $file->id,
                    'name' => $file->file_name,
                    'url' => $file->file_path ? Storage::url($file->file_path) : null,
                ])->values()
                : [],
            'isOpen' => $assignment->dibuka_pada
                ? $assignment->dibuka_pada->isPast()
                : true,
            'isClosed' => $assignment->ditutup_pada
                ? $assignment->ditutup_pada->isPast()
                : false,
        ];
    }

    protected function ensureAssignmentAccessible(Assignment $assignment, Siswa $siswa, bool $requireOpenWindow = false): Assignment
    {
        $assignment->loadMissing('kelas');

        if ($assignment->status === 'draft') {
            abort(404);
        }

        if (!$siswa->kelas_id || !$assignment->kelas->contains('id', $siswa->kelas_id)) {
            abort(403, 'Anda tidak terdaftar pada kelas tugas ini.');
        }

        if ($requireOpenWindow) {
            if ($assignment->dibuka_pada && $assignment->dibuka_pada->isFuture()) {
                abort(403, 'Tugas belum dibuka.');
            }
        }

        return $assignment;
    }

    protected function resolveStudent(): Siswa
    {
        return auth()->user()
            ->siswa()
            ->with('kelas')
            ->firstOrFail();
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

    protected function purgeSubmissionFiles($files): void
    {
        $files->each(function (AssignmentSubmissionFile $file) {
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }

            $file->delete();
        });
    }

    protected function defaultAllowedFileTypes(): array
    {
        return ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.jpg', '.png'];
    }
}
