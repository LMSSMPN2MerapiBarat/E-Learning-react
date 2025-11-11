<?php

namespace App\Imports;

use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

class SiswaImport implements
    ToCollection,
    WithHeadingRow,
    WithValidation,
    SkipsOnFailure,
    WithChunkReading
{
    use SkipsFailures;

    protected array $existingEmails = [];
    protected array $existingNis = [];
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

        $this->existingNis = Siswa::query()
            ->whereNotNull('nis')
            ->pluck('nis')
            ->reduce(function (array $carry, string $nis) {
                $key = $this->normalizeNumeric($nis);
                if ($key !== null) {
                    $carry[$key] = true;
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
        $pendingSiswas = [];

        foreach ($rows as $row) {
            $this->processed++;

            $nama = $row['nama'] ?? $row['Nama'] ?? 'Tanpa Nama';
            $email = $row['email'] ?? $row['Email'] ?? uniqid('siswa_') . '@example.com';
            $nis = $row['nis'] ?? $row['NIS'] ?? null;
            $kelasNama = $row['kelas'] ?? $row['Kelas'] ?? null;
            $noTelp = $row['no_telepon'] ?? $row['No. Telepon'] ?? null;
            $tempatLahir = $this->sanitizeBirthPlace($row['tempat_lahir'] ?? $row['Tempat Lahir'] ?? null);
            $tanggalLahir = $this->normalizeDateValue($row['tanggal_lahir'] ?? $row['Tanggal Lahir'] ?? null);

            $emailKey = $this->normalizeKey($email);
            if ($emailKey !== null && isset($this->existingEmails[$emailKey])) {
                $this->markSkipped($row->toArray(), 'Email sudah terdaftar. Baris dilewati.');
                continue;
            }

            $normalizedNis = $this->normalizeNumeric($nis);
            if ($normalizedNis !== null && isset($this->existingNis[$normalizedNis])) {
                $this->markSkipped($row->toArray(), "NIS {$normalizedNis} sudah terdaftar. Baris dilewati.");
                continue;
            }

            if ($emailKey === null) {
                $this->markSkipped($row->toArray(), 'Email tidak valid.');
                continue;
            }

            $tingkat = $this->determineTingkat($kelasNama);
            $kelasId = $this->resolveKelasId($kelasNama, $tingkat);

            $genderInput = strtolower(trim($row['jenis_kelamin'] ?? $row['gender'] ?? ''));
            $gender = in_array($genderInput, ['laki-laki', 'perempuan'], true) ? $genderInput : null;

            $usersToInsert[] = [
                'name' => $nama,
                'email' => $email,
                'password' => $this->defaultPasswordHash(),
                'role' => 'siswa',
                'jenis_kelamin' => $gender,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $pendingSiswas[] = [
                'email' => $email,
                'email_key' => $emailKey,
                'nis' => $normalizedNis,
                'kelas_id' => $kelasId,
                'no_telp' => $noTelp,
                'tempat_lahir' => $tempatLahir,
                'tanggal_lahir' => $tanggalLahir,
            ];
        }

        if (empty($usersToInsert)) {
            return;
        }

        DB::transaction(function () use ($usersToInsert, $pendingSiswas, $now) {
            DB::table('users')->insert($usersToInsert);

            $emailKeys = array_column($pendingSiswas, 'email_key');
            $emails = array_column($pendingSiswas, 'email');

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

            $siswasData = [];
            foreach ($pendingSiswas as $entry) {
                $emailKey = $entry['email_key'];
                if (!isset($insertedUsers[$emailKey])) {
                    continue;
                }

                $siswasData[] = [
                    'user_id' => $insertedUsers[$emailKey],
                    'nis' => $entry['nis'],
                    'kelas_id' => $entry['kelas_id'],
                    'no_telp' => $entry['no_telp'],
                    'tempat_lahir' => $entry['tempat_lahir'],
                    'tanggal_lahir' => $entry['tanggal_lahir'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (!empty($siswasData)) {
                DB::table('siswas')->insert($siswasData);
                $this->created += count($siswasData);

                foreach ($pendingSiswas as $entry) {
                    $this->existingEmails[$entry['email_key']] = true;
                    if ($entry['nis'] !== null) {
                        $this->existingNis[$entry['nis']] = true;
                    }
                }
            }
        });
    }

    public function rules(): array
    {
        return [
            '*.nama' => 'required|string',
            '*.email' => 'nullable|email|unique:users,email',
            '*.nis' => 'nullable|unique:siswas,nis',
            '*.tempat_lahir' => 'nullable|string',
            '*.tanggal_lahir' => 'nullable|date',
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

    protected function sanitizeBirthPlace(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = preg_replace('/[^\pL\s]/u', ' ', (string) $value);
        $clean = trim(preg_replace('/\s+/', ' ', $clean));

        return $clean !== '' ? $clean : null;
    }

    protected function normalizeDateValue($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            if (is_numeric($value)) {
                return Carbon::instance(ExcelDate::excelToDateTimeObject((float) $value))->format('Y-m-d');
            }

            return Carbon::parse((string) $value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    protected function defaultPasswordHash(): string
    {
        if ($this->defaultPasswordHash === null) {
            $this->defaultPasswordHash = Hash::make(config('app.import_default_password', 'password'));
        }

        return $this->defaultPasswordHash;
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

    protected function determineTingkat(?string $kelasNama): string
    {
        if ($kelasNama === null) {
            return 'Kelas 7';
        }

        $nama = mb_strtolower($kelasNama);

        // if (str_contains($nama, 'xii') || str_contains($nama, '12')) {
        //     return 'Kelas 12';
        // }

        // if (str_contains($nama, 'xi') || str_contains($nama, '11')) {
        //     return 'Kelas 11';
        // }

        if (str_contains($nama, 'ix') || str_contains($nama, '9')) {
            return 'Kelas 9';
        }

        // if (str_contains($nama, 'x') || str_contains($nama, '10')) {
        //     return 'Kelas 10';
        // }

        if (str_contains($nama, 'viii') || str_contains($nama, '8')) {
            return 'Kelas 8';
        }

        return 'Kelas 7';
    }

    protected function resolveKelasId(?string $kelasNama, string $tingkat): ?int
    {
        if ($kelasNama === null || trim($kelasNama) === '') {
            return null;
        }

        $key = $this->normalizeKey($kelasNama);

        if ($key === null) {
            return null;
        }

        if (!isset($this->kelasCache[$key])) {
            $kelas = Kelas::create([
                'kelas' => trim($kelasNama),
                'tingkat' => $tingkat,
                'tahun_ajaran' => date('Y') . '/' . (date('Y') + 1),
            ]);

            $this->kelasCache[$key] = $kelas->id;
        }

        return $this->kelasCache[$key];
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
