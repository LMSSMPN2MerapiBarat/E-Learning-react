<?php

namespace App\Exports;

use App\Models\Kelas;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class KelasWithStudentsExport implements WithMultipleSheets
{
    protected array $kelasIds;

    public function __construct(array $kelasIds = [])
    {
        $this->kelasIds = $kelasIds;
    }

    public function sheets(): array
    {
        $sheets = [];

        // Optimized query: eager load with specific fields only
        $query = Kelas::select(['id', 'tingkat', 'kelas'])
            ->with(['siswa:id,kelas_id,user_id,nis,no_telp', 'siswa.user:id,name,email,jenis_kelamin'])
            ->orderBy('tingkat')
            ->orderBy('kelas');
        
        if (!empty($this->kelasIds)) {
            $query->whereIn('id', $this->kelasIds);
        }

        $kelasList = $query->get();

        foreach ($kelasList as $kelas) {
            $sheets[] = new KelasStudentSheet($kelas);
        }

        return $sheets;
    }
}
