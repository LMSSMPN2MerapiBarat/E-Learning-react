<?php

namespace App\Exports;

use App\Models\Kelas;
use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class KelasStudentSheet implements FromArray, WithHeadings, WithTitle, WithEvents, ShouldAutoSize
{
    protected Kelas $kelas;

    public function __construct(Kelas $kelas)
    {
        $this->kelas = $kelas;
    }

    public function array(): array
    {
        $data = [];
        $index = 0;

        foreach ($this->kelas->siswa as $siswa) {
            $index++;
            $user = $siswa->user;
            
            $data[] = [
                $index,
                $siswa->nis ?? '-',
                $user->name ?? '-',
                $user->email ?? '-',
                $user->jenis_kelamin ?? '-',
                $siswa->no_telp ?? '-',
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'No',
            'NIS',
            'Nama Siswa',
            'Email',
            'Jenis Kelamin',
            'No. Telepon',
        ];
    }

    public function title(): string
    {
        $title = trim(($this->kelas->tingkat ?? '') . ' ' . ($this->kelas->kelas ?? ''));
        $title = substr(preg_replace('/[\\\\\/\*\?\[\]:\'\"]/', '', $title), 0, 31);
        return $title ?: 'Sheet';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestColumn = $sheet->getHighestColumn();
                
                // Insert 5 rows at the top for header info
                $sheet->insertNewRowBefore(1, 5);
                
                // Header info
                $kelasName = trim(($this->kelas->tingkat ?? '') . ' ' . ($this->kelas->kelas ?? ''));
                $sheet->setCellValue('A1', 'Daftar Siswa ' . $kelasName);
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                
                $sheet->setCellValue('A2', 'SMPN 2 MERAPI BARAT');
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                
                $sheet->setCellValue('A3', 'Kec. Merapi Barat, Kab. Lahat, Prov. Sumatera Selatan');
                $sheet->mergeCells('A3:' . $highestColumn . '3');
                
                $timestamp = Carbon::now('Asia/Jakarta')->format('Y-m-d H:i:s');
                $sheet->setCellValue('A4', 'Tanggal Unduh: ' . $timestamp . ' WIB');
                $sheet->mergeCells('A4:' . $highestColumn . '4');
                
                // Style header info rows
                $sheet->getStyle('A1')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 14],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);
                $sheet->getStyle('A2')->applyFromArray([
                    'font' => ['bold' => true, 'size' => 12],
                    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
                ]);
                $sheet->getStyle('A3:A4')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                
                // Style table header (row 6)
                $sheet->getStyle('A6:' . $highestColumn . '6')->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'DBEAFE'],
                    ],
                    'borders' => [
                        'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);
                
                // Auto size columns
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
                
                // Style data rows (row 7 onwards)
                $lastRow = $sheet->getHighestRow();
                if ($lastRow > 6) {
                    $sheet->getStyle('A7:' . $highestColumn . $lastRow)->applyFromArray([
                        'borders' => [
                            'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                        ],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                        ],
                    ]);
                }
            },
        ];
    }
}
