<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use Smalot\PdfParser\Parser as PdfParser;

class DocumentProcessorService
{
    /**
     * Extract text content from uploaded document
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return array ['text' => string, 'language' => 'id'|'en']
     * @throws Exception
     */
    public function extractText($file): array
    {
        $extension = strtolower($file->getClientOriginalExtension());

        $text = match ($extension) {
            'docx', 'doc' => $this->extractFromWord($file),
            'pdf' => $this->extractFromPdf($file),
            default => throw new Exception("Unsupported file type: {$extension}. Only Word (.doc, .docx) and PDF files are supported.")
        };

        if (empty(trim($text))) {
            throw new Exception('No text could be extracted from the document. Please ensure the document contains readable text.');
        }

        // Clean and normalize the text
        $cleanText = $this->cleanText($text);

        // Detect language
        $language = $this->detectLanguage($cleanText);

        return [
            'text' => $cleanText,
            'language' => $language
        ];
    }

    /**
     * Extract text from Word document
     */
    private function extractFromWord($file): string
    {
        try {
            $phpWord = IOFactory::load($file->getRealPath());
            $text = '';

            foreach ($phpWord->getSections() as $section) {
                foreach ($section->getElements() as $element) {
                    if (method_exists($element, 'getText')) {
                        $elementText = $element->getText();
                        // Handle case where getText() returns array
                        if (is_array($elementText)) {
                            $elementText = implode(' ', array_filter($elementText, 'is_string'));
                        }
                        $text .= $elementText . "\n";
                    } elseif (method_exists($element, 'getElements')) {
                        // Handle nested elements like tables, text runs, etc.
                        $text .= $this->extractNestedText($element) . "\n";
                    }
                }
            }

            return $text;
        } catch (Exception $e) {
            throw new Exception('Gagal membaca dokumen Word. Pastikan file tidak rusak dan berformat .docx atau .doc yang valid.');
        }
    }

    /**
     * Extract nested text from Word elements
     */
    private function extractNestedText($element): string
    {
        $text = '';

        if (method_exists($element, 'getElements')) {
            foreach ($element->getElements() as $child) {
                if (method_exists($child, 'getText')) {
                    $childText = $child->getText();
                    // Handle case where getText() returns array
                    if (is_array($childText)) {
                        $childText = implode(' ', array_filter($childText, 'is_string'));
                    }
                    $text .= $childText . ' ';
                } elseif (method_exists($child, 'getElements')) {
                    $text .= $this->extractNestedText($child) . ' ';
                }
            }
        }

        return $text;
    }

    /**
     * Extract text from PDF document
     */
    private function extractFromPdf($file): string
    {
        try {
            $parser = new PdfParser();
            $pdf = $parser->parseFile($file->getRealPath());
            $text = $pdf->getText();

            return $text;
        } catch (Exception $e) {
            throw new Exception('Failed to read PDF document: ' . $e->getMessage());
        }
    }

    /**
     * Clean and normalize extracted text
     */
    private function cleanText(string $text): string
    {
        // Remove excessive whitespace
        $text = preg_replace('/\s+/', ' ', $text);
        
        // Remove special characters that might interfere with AI processing
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $text);
        
        // Trim
        $text = trim($text);

        // Limit length to prevent API issues (max ~50000 characters)
        if (strlen($text) > 50000) {
            $text = substr($text, 0, 50000) . '...';
        }

        return $text;
    }

    /**
     * Detect language from text content
     * Simple keyword-based detection for Indonesian vs English
     *
     * @param string $text
     * @return string 'id' or 'en'
     */
    private function detectLanguage(string $text): string
    {
        // Convert to lowercase for comparison
        $lowerText = Str::lower($text);

        // Common Indonesian words
        $indonesianKeywords = [
            'yang', 'dan', 'untuk', 'dengan', 'adalah', 'dari', 'ini', 'pada',
            'sebagai', 'dalam', 'akan', 'dapat', 'atau', 'telah', 'kepada',
            'tersebut', 'sehingga', 'oleh', 'seperti', 'bahwa', 'juga', 'karena'
        ];

        // Common English words
        $englishKeywords = [
            'the', 'and', 'for', 'with', 'that', 'from', 'this', 'have',
            'which', 'their', 'would', 'about', 'there', 'these', 'other',
            'when', 'where', 'what', 'which', 'also', 'because', 'been'
        ];

        $indonesianScore = 0;
        $englishScore = 0;

        // Count occurrences of language-specific keywords
        foreach ($indonesianKeywords as $keyword) {
            $indonesianScore += substr_count($lowerText, ' ' . $keyword . ' ');
        }

        foreach ($englishKeywords as $keyword) {
            $englishScore += substr_count($lowerText, ' ' . $keyword . ' ');
        }

        // Return language with higher score, default to Indonesian
        return $englishScore > $indonesianScore ? 'en' : 'id';
    }
}
