<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminClassScheduleController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/JadwalKelas/Jadwal', [
            'schedules' => $this->schedulesPayload(),
            'reference' => $this->referenceOptions(),
            'stats'     => $this->scheduleStats(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/JadwalKelas/Create', [
            'reference' => $this->referenceOptions(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);

        ClassSchedule::create($data);

        return redirect()
            ->route('admin.jadwal-kelas.index')
            ->with('success', 'Jadwal pelajaran berhasil ditambahkan.');
    }

    public function edit(ClassSchedule $schedule)
    {
        $schedule->load(['guru.user', 'mataPelajaran', 'kelas']);

        return Inertia::render('admin/JadwalKelas/Edit', [
            'reference' => $this->referenceOptions(),
            'schedule'  => $this->transformSchedule($schedule),
        ]);
    }

    public function update(Request $request, ClassSchedule $schedule)
    {
        $data = $this->validatePayload($request);

        $schedule->update($data);

        return redirect()
            ->route('admin.jadwal-kelas.index')
            ->with('success', 'Jadwal pelajaran berhasil diperbarui.');
    }

    public function destroy(ClassSchedule $schedule)
    {
        $schedule->delete();

        return back()->with('success', 'Jadwal pelajaran berhasil dihapus.');
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'guru_id'            => ['required', 'exists:gurus,id'],
            'mata_pelajaran_id'  => ['required', 'exists:mata_pelajarans,id'],
            'kelas_id'           => ['required', 'exists:kelas,id'],
            'day'                => ['required', Rule::in(ClassSchedule::DAY_OPTIONS)],
            'start_time'         => ['required', 'date_format:H:i'],
            'end_time'           => ['required', 'date_format:H:i', 'after:start_time'],
            'room'               => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function schedulesPayload()
    {
        return ClassSchedule::with(['guru.user', 'mataPelajaran', 'kelas'])
            ->orderByRaw("FIELD(day, '" . implode("','", ClassSchedule::DAY_OPTIONS) . "')")
            ->orderBy('start_time')
            ->get()
            ->map(fn ($schedule) => $this->transformSchedule($schedule));
    }

    private function transformSchedule(ClassSchedule $schedule): array
    {
        $teacherName = $schedule->guru?->user?->name
            ?? $schedule->guru?->user?->email
            ?? 'Guru #' . $schedule->guru_id;

        return [
            'id'         => $schedule->id,
            'day'        => $schedule->day,
            'startTime'  => substr((string) $schedule->start_time, 0, 5),
            'endTime'    => substr((string) $schedule->end_time, 0, 5),
            'room'       => $schedule->room,
            'teacher'    => [
                'id'   => $schedule->guru_id,
                'name' => $teacherName,
            ],
            'subject'    => [
                'id'   => $schedule->mata_pelajaran_id,
                'name' => $schedule->mataPelajaran->nama_mapel ?? 'Tidak diketahui',
            ],
            'class'      => [
                'id'    => $schedule->kelas_id,
                'label' => $this->formatClassLabel($schedule->kelas),
            ],
        ];
    }

    private function referenceOptions(): array
    {
        $teachers = Guru::with(['user', 'kelas', 'mataPelajaran'])
            ->get()
            ->map(function ($guru) {
                $name = $guru->user->name ?? $guru->user->email ?? ('Guru #' . $guru->id);

                $subjects = $guru->mataPelajaran
                    ? $guru->mataPelajaran
                        ->map(function ($subject) {
                            return [
                                'id'   => $subject->id,
                                'name' => $subject->nama_mapel,
                            ];
                        })
                        ->values()
                        ->all()
                    : [];

                $classes = $guru->kelas
                    ? $guru->kelas
                        ->map(function ($class) {
                            return [
                                'id'    => $class->id,
                                'label' => $this->formatClassLabel($class),
                            ];
                        })
                        ->values()
                        ->all()
                    : [];

                return [
                    'id'       => $guru->id,
                    'name'     => $name,
                    'nip'      => $guru->nip,
                    'subjects' => $subjects,
                    'classes'  => $classes,
                ];
            })
            ->sortBy('name')
            ->values()
            ->all();

        $subjects = MataPelajaran::orderBy('nama_mapel')
            ->get()
            ->map(fn ($subject) => [
                'id'   => $subject->id,
                'name' => $subject->nama_mapel,
            ])
            ->values()
            ->all();

        $classes = Kelas::orderBy('tingkat')
            ->orderBy('kelas')
            ->get()
            ->map(fn ($class) => [
                'id'    => $class->id,
                'label' => $this->formatClassLabel($class),
            ])
            ->values()
            ->all();

        return [
            'teachers' => $teachers,
            'subjects' => $subjects,
            'classes'  => $classes,
            'days'     => ClassSchedule::DAY_OPTIONS,
        ];
    }

    private function scheduleStats(): array
    {
        return [
            'total'         => ClassSchedule::count(),
            'distinctClass' => ClassSchedule::distinct('kelas_id')->count('kelas_id'),
            'distinctGuru'  => ClassSchedule::distinct('guru_id')->count('guru_id'),
        ];
    }

    private function formatClassLabel(?Kelas $class): string
    {
        if (! $class) {
            return 'Kelas tidak diketahui';
        }

        $tingkat = trim((string) ($class->tingkat ?? ''));
        $kelas = trim((string) ($class->kelas ?? ''));
        $label = trim($tingkat . ' ' . $kelas);

        return $label !== '' ? $label : ($kelas ?: ($tingkat ?: 'Kelas'));
    }
}
