<?php

namespace App\Imports;

use App\Models\Guru;
use App\Models\Kelas;
use App\Models\MataPelajaran;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class GuruImport implements ToCollection, WithHeadingRow, WithValidation, WithChunkReading
{
    /**
     * Specify which row contains the headings
     * Row 6 because rows 1-5 contain school information headers
     */
    public function headingRow(): int
    {
        return 6;
    }

    protected array $existingEmails = [];
    protected array $existingNips = [];
    protected array $mapelCache = [];
    protected array $kelasCache = [];
    protected ?string $defaultPasswordHash = null;

    protected int $processed = 0;
    protected int $created = 0;
    protected int $skipped = 0;
    protected array $skippedNotes = [];

    public function __construct()
    {
        $this->existingEmails = User::query()
            ->pluck('email')
            ->reduce(function (array $carry, string $email) {
                $key = $this->normalizeKey($email);
                if ($key !== null) {
                    $carry[$key] = true;
                }
                return $carry;
            }, []);

        $this->existingNips = Guru::query()
            ->whereNotNull('nip')
            ->pluck('nip')
            ->reduce(function (array $carry, string $nip) {
                $key = $this->normalizeNumeric($nip);
                if ($key !== null) {
                    $carry[$key] = true;
                }
                return $carry;
            }, []);

        $this->mapelCache = MataPelajaran::query()
            ->get(['id', 'nama_mapel'])
            ->reduce(function (array $carry, MataPelajaran $mapel) {
                $key = $this->normalizeKey($mapel->nama_mapel);
                if ($key !== null) {
                    $carry[$key] = $mapel->id;
                }
                return $carry;
            }, []);

        $this->kelasCache = Kelas::query()
            ->get(['id', 'kelas'])
            ->reduce(function (array $carry, Kelas $kelas) {
                $key = $this->normalizeKey($kelas->kelas);
                if ($key !== null) {
                    $carry[$key] = $kelas->id;
                }
                return $carry;
            }, []);
    }

    public function collection(Collection $rows): void
    {
        if ($rows->isEmpty()) {
            return;
        }

        $now = now();
        $usersToInsert = [];
        $pendingGurus = [];

        foreach ($rows as $row) {
            $this->processed++;

            $name = $row['nama'] ?? $row['Nama'] ?? 'Tanpa Nama';
            $email = $row['email'] ?? $row['Email'] ?? uniqid('guru_') . '@example.com';
            $nip = $row['nip'] ?? $row['NIP'] ?? null;
            $mapelString = $row['mapel'] ?? $row['Mapel'] ?? $row['mapel_yang_diajar'] ?? $row['Mapel yang Diajar'] ?? null;
            $kelasString = $row['kelas'] ?? $row['Kelas'] ?? $row['kelas_yang_diajar'] ?? $row['Kelas yang Diajar'] ?? null;
            $noTelp = $row['no_telp'] ?? $row['No. Telepon'] ?? $row['no_telepon'] ?? null;

            $emailKey = $this->normalizeKey($email);
            if ($emailKey !== null && isset($this->existingEmails[$emailKey])) {
                $this->markSkipped($row->toArray(), 'Email sudah terdaftar. Baris dilewati.');
                continue;
            }

            $normalizedNip = $this->normalizeNumeric($nip);
            if ($normalizedNip !== null && isset($this->existingNips[$normalizedNip])) {
                $this->markSkipped($row->toArray(), "NIP {$normalizedNip} sudah terdaftar. Baris dilewati.");
                continue;
            }

            if ($emailKey === null) {
                $this->markSkipped($row->toArray(), 'Email tidak valid.');
                continue;
            }

            $genderInput = strtolower(trim($row['jenis_kelamin'] ?? $row['gender'] ?? ''));
            $gender = in_array($genderInput, ['laki-laki', 'perempuan'], true) ? $genderInput : null;

            $mapelIds = $this->resolveMapelIds($mapelString);
            $kelasIds = $this->resolveKelasIds($kelasString);

            $usersToInsert[] = [
                'name' => $name,
                'email' => $email,
                'password' => $this->defaultPasswordHash(),
                'role' => 'guru',
                'jenis_kelamin' => $gender,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $pendingGurus[] = [
                'email' => $email,
                'email_key' => $emailKey,
                'nip' => $normalizedNip,
                'no_telp' => $noTelp,
                'mapel_ids' => $mapelIds,
                'kelas_ids' => $kelasIds,
            ];
        }

        if (empty($usersToInsert)) {
            return;
        }

        DB::transaction(function () use ($usersToInsert, $pendingGurus, $now) {
            DB::table('users')->insert($usersToInsert);

            $emails = array_column($pendingGurus, 'email');
            $insertedUsers = User::query()
                ->whereIn('email', $emails)
                ->get(['id', 'email'])
                ->reduce(function (array $carry, User $user) {
                    $key = $this->normalizeKey($user->email);
                    if ($key !== null) {
                        $carry[$key] = $user->id;
                    }
                    return $carry;
                }, []);

            $gurusData = [];
            foreach ($pendingGurus as $entry) {
                $emailKey = $entry['email_key'];
                if (!isset($insertedUsers[$emailKey])) {
                    continue;
                }

                $gurusData[] = [
                    'user_id' => $insertedUsers[$emailKey],
                    'nip' => $entry['nip'],
                    'no_telp' => $entry['no_telp'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (empty($gurusData)) {
                return;
            }

            DB::table('gurus')->insert($gurusData);
            $this->created += count($gurusData);

            $userIds = array_column($gurusData, 'user_id');
            $insertedGurus = Guru::query()
                ->whereIn('user_id', $userIds)
                ->get(['id', 'user_id'])
                ->reduce(function (array $carry, Guru $guru) {
                    $carry[$guru->user_id] = $guru->id;
                    return $carry;
                }, []);

            $mapelPivot = [];
            $kelasPivot = [];

            foreach ($pendingGurus as $entry) {
                $emailKey = $entry['email_key'];
                if (!isset($insertedUsers[$emailKey])) {
                    continue;
                }

                $userId = $insertedUsers[$emailKey];
                $guruId = $insertedGurus[$userId] ?? null;

                if ($guruId !== null) {
                    foreach ($entry['mapel_ids'] as $mapelId) {
                        $mapelPivot[] = [
                            'guru_id' => $guruId,
                            'mata_pelajaran_id' => $mapelId,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    }
                }

                foreach ($entry['kelas_ids'] as $kelasId) {
                    $kelasPivot[] = [
                        'user_id' => $userId,
                        'kelas_id' => $kelasId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                $this->existingEmails[$emailKey] = true;
                if ($entry['nip'] !== null) {
                    $this->existingNips[$entry['nip']] = true;
                }
            }

            if (!empty($mapelPivot)) {
                DB::table('guru_mata_pelajaran')->insert($mapelPivot);
            }

            if (!empty($kelasPivot)) {
                DB::table('guru_kelas')->insertOrIgnore($kelasPivot);
            }
        });
    }

    public function rules(): array
    {
        return [
            '*.email' => 'nullable|email|unique:users,email',
            '*.nip' => 'nullable|unique:gurus,nip',
        ];
    }

    public function chunkSize(): int
    {
        return 200;
    }

    public function summary(): array
    {
        return [
            'processed' => $this->processed,
            'created' => $this->created,
            'skipped' => $this->skipped,
            'notes' => $this->skippedNotes,
        ];
    }

    protected function defaultPasswordHash(): string
    {
        if ($this->defaultPasswordHash === null) {
            $this->defaultPasswordHash = Hash::make(config('app.import_default_password', 'password'));
        }

        return $this->defaultPasswordHash;
    }

    protected function resolveMapelIds(?string $mapelString): array
    {
        if (empty($mapelString)) {
            return [];
        }

        $names = array_filter(array_map('trim', preg_split('/[,;]/', (string) $mapelString)));
        $ids = [];

        foreach ($names as $nama) {
            $key = $this->normalizeKey($nama);
            if ($key === null) {
                continue;
            }

            if (!isset($this->mapelCache[$key])) {
                $mapel = MataPelajaran::create([
                    'nama_mapel' => $nama,
                ]);
                $this->mapelCache[$key] = $mapel->id;
            }

            $ids[] = $this->mapelCache[$key];
        }

        return array_values(array_unique($ids));
    }

    protected function resolveKelasIds(?string $kelasString): array
    {
        if (empty($kelasString)) {
            return [];
        }

        $names = array_filter(array_map('trim', preg_split('/[,;]/', (string) $kelasString)));
        $ids = [];

        foreach ($names as $namaKelas) {
            $key = $this->normalizeKey($namaKelas);
            if ($key === null) {
                continue;
            }

            if (!isset($this->kelasCache[$key])) {
                $kelas = Kelas::create([
                    'kelas' => $namaKelas,
                    'tingkat' => $this->determineTingkat($namaKelas),
                    'tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
                ]);
                $this->kelasCache[$key] = $kelas->id;
            }

            $ids[] = $this->kelasCache[$key];
        }

        return array_values(array_unique($ids));
    }

    private function determineTingkat(string $kelasNama): string
    {
        $nama = strtolower($kelasNama);

        if (str_contains($nama, 'xii') || str_contains($nama, '12')) {
            return 'Kelas 12';
        }

        if (str_contains($nama, 'xi') || str_contains($nama, '11')) {
            return 'Kelas 11';
        }

        // Check for IX (9) before X (10) to avoid misclassification because 'ix' contains 'x'
        if (str_contains($nama, 'ix') || str_contains($nama, '9')) {
            return 'Kelas 9';
        }

        if (str_contains($nama, 'x') || str_contains($nama, '10')) {
            return 'Kelas 10';
        }

        if (str_contains($nama, 'viii') || str_contains($nama, '8')) {
            return 'Kelas 8';
        }

        return 'Kelas 7';
    }

    protected function normalizeKey(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $normalized = preg_replace('/\s+/', ' ', trim((string) $value));

        if ($normalized === '') {
            return null;
        }

        return mb_strtolower($normalized);
    }

    protected function normalizeNumeric(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', (string) $value);

        return $digits !== '' ? $digits : null;
    }

    protected function markSkipped(array $row, string $reason): void
    {
        $this->skipped++;

        if (count($this->skippedNotes) < 10) {
            $this->skippedNotes[] = [
                'row' => $row,
                'reason' => $reason,
            ];
        }
    }
}
