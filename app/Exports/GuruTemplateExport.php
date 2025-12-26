<?php

namespace App\Exports;

use Illuminate\Support\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

/**
 * Template Export for Guru - Contains only headers, no data
 */
class GuruTemplateExport implements FromArray, WithHeadings, WithEvents, WithStyles, WithTitle
{
    public function array(): array
    {
        return [];
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Jenis Kelamin',
            'Email',
            'NIP',
            'Mapel yang Diajar',
            'Kelas yang Diajar',
            'No. Telepon',
        ];
    }

    public function title(): string
    {
        return 'Template Guru';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 14],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
            2 => [
                'font' => ['bold' => true, 'size' => 12],
            ],
            6 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E7E6E6'],
                ],
                'borders' => [
                    'allBorders' => ['borderStyle' => Border::BORDER_THIN],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $highestColumn = 'G'; // 7 columns (A to G)
                
                $sheet->insertNewRowBefore(1, 5);
                
                $sheet->setCellValue('A1', 'Daftar Tenaga Pendidik');
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                
                $sheet->setCellValue('A2', 'SMPN 2 MERAPI BARAT');
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                
                $sheet->setCellValue('A3', 'Kec. Merapi Barat, Kab. Lahat, Prov. Sumatera Selatan');
                $sheet->mergeCells('A3:' . $highestColumn . '3');
                
                // Row 4 & 5: Empty (no timestamp for template)
                
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
