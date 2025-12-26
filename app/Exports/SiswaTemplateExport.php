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
 * Template Export for Siswa - Contains only headers, no data
 */
class SiswaTemplateExport implements FromArray, WithHeadings, WithEvents, WithStyles, WithTitle
{
    public function array(): array
    {
        // Return empty array - template only needs headers, no data
        return [];
    }

    public function headings(): array
    {
        return [
            'Nama',
            'Jenis Kelamin',
            'Email',
            'NISN',
            'Tempat Lahir',
            'Tanggal Lahir',
            'Kelas',
            'Tahun Ajaran',
            'No. Telepon',
        ];
    }

    public function title(): string
    {
        return 'Template Siswa';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style for header title row (row 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                ],
            ],
            // Style for school name row (row 2)
            2 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                ],
            ],
            // Style for column headers (row 6)
            6 => [
                'font' => [
                    'bold' => true,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'E7E6E6',
                    ],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                    ],
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
                $highestColumn = 'I'; // 9 columns (A to I)
                
                // Insert header rows at the top (5 rows - same as export for consistency)
                $sheet->insertNewRowBefore(1, 5);
                
                // Row 1: Title
                $sheet->setCellValue('A1', 'Daftar Peserta Didik');
                $sheet->mergeCells('A1:' . $highestColumn . '1');
                
                // Row 2: School name
                $sheet->setCellValue('A2', 'SMPN 2 MERAPI BARAT');
                $sheet->mergeCells('A2:' . $highestColumn . '2');
                
                // Row 3: Location
                $sheet->setCellValue('A3', 'Kec. Merapi Barat, Kab. Lahat, Prov. Sumatera Selatan');
                $sheet->mergeCells('A3:' . $highestColumn . '3');
                
                // Row 4: Empty (no timestamp for template)
                // Row 5: Empty (separator)
                
                // Auto-size columns
                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
