<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GroqAIService
{
    private string $apiKey;
    private string $model;
    private string $fallbackModel;
    private string $baseUrl = 'https://api.groq.com/openai/v1';

    public function __construct()
    {
        $this->apiKey = config('services.groq.api_key');
        $this->model = config('services.groq.model');
        $this->fallbackModel = config('services.groq.fallback_model');

        if (empty($this->apiKey)) {
            throw new Exception('Groq API key not configured. Please set GROQ_API_KEY in .env file.');
        }
    }

    /**
     * Generate quiz questions from learning material
     *
     * @param string $materialText The extracted text from the document
     * @param string $language Detected language ('id' or 'en')
     * @param int $numberOfQuestions Number of questions to generate
     * @return array Generated quiz data
     * @throws Exception
     */
    public function generateQuiz(string $materialText, string $language, int $numberOfQuestions): array
    {
        $prompt = $this->buildPrompt($materialText, $language, $numberOfQuestions);

        try {
            // Try with primary model first
            try {
                Log::info('Attempting quiz generation with primary model', [
                    'model' => $this->model
                ]);
                
                $generatedText = $this->callGroqAPI($prompt, $this->model);
                $quizData = $this->parseJsonWithRepair($generatedText);
                $this->validateQuizStructure($quizData);
                
                Log::info('Quiz generated successfully with primary model', [
                    'model' => $this->model
                ]);
                
                return $quizData;
                
            } catch (Exception $e) {
                // Check if it's a rate limit error (429)
                if ($this->isRateLimitError($e)) {
                    Log::warning('Primary model rate limit reached, trying fallback model', [
                        'primary_model' => $this->model,
                        'fallback_model' => $this->fallbackModel,
                        'error' => $e->getMessage()
                    ]);
                    
                    // Retry with fallback model
                    $generatedText = $this->callGroqAPI($prompt, $this->fallbackModel);
                    $quizData = $this->parseJsonWithRepair($generatedText);
                    $this->validateQuizStructure($quizData);
                    
                    Log::info('Quiz generated successfully with fallback model', [
                        'model' => $this->fallbackModel
                    ]);
                    
                    return $quizData;
                }
                
                // If not rate limit error, rethrow
                throw $e;
            }

        } catch (Exception $e) {
            Log::error('Groq AI Service Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Check if exception is a rate limit error
     */
    private function isRateLimitError(Exception $e): bool
    {
        $message = $e->getMessage();
        return str_contains($message, '429') || 
               str_contains($message, 'rate limit') || 
               str_contains($message, 'Rate limit') ||
               str_contains($message, 'quota');
    }

    /**
     * Call Groq API with specified model
     */
    private function callGroqAPI(string $prompt, string $model): string
    {
        $url = "{$this->baseUrl}/chat/completions";
        
        Log::info('Groq API Request', [
            'url' => $url,
            'model' => $model,
            'has_api_key' => !empty($this->apiKey)
        ]);
        
        $response = Http::timeout(60)
            ->retry(2, 1000)
            ->withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])
            ->post($url, [
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.2,
                'max_tokens' => 8192,
                'top_p' => 0.9,
            ]);

        if (!$response->successful()) {
            Log::error('Groq API Error', [
                'status' => $response->status(),
                'url' => $url,
                'body' => $response->body(),
                'model' => $model
            ]);
            
            $errorBody = $response->body();
            throw new Exception('Gagal membuat kuis dari AI: ' . $errorBody);
        }

        $result = $response->json();
        
        $generatedText = $result['choices'][0]['message']['content'] ?? '';
        
        if (empty($generatedText)) {
            throw new Exception('AI mengembalikan respons kosong');
        }

        return $generatedText;
    }

    /**
     * Parse JSON with multiple repair strategies
     */
    private function parseJsonWithRepair(string $generatedText): array
    {
        // Strategy 1: Try parsing original text
        $quizData = json_decode($generatedText, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($quizData)) {
            Log::info('JSON parsed successfully on first attempt');
            return $quizData;
        }
        
        Log::warning('First JSON parse failed, trying extraction', [
            'error' => json_last_error_msg()
        ]);

        // Strategy 2: Extract and clean JSON, then parse
        $jsonText = $this->extractJson($generatedText);
        $quizData = json_decode($jsonText, true);
        
        if (json_last_error() === JSON_ERROR_NONE && is_array($quizData)) {
            Log::info('JSON parsed successfully after extraction');
            return $quizData;
        }
        
        Log::warning('Second JSON parse failed, trying aggressive repair', [
            'error' => json_last_error_msg()
        ]);

        // Strategy 3: Aggressive repair - try multiple times with different fixes
        $repairStrategies = [
            function($json) {
                // Remove all whitespace between keys and values
                return preg_replace('/\s+/', ' ', $json);
            },
            function($json) {
                // Fix common quote issues (smart quotes to regular quotes)
                return str_replace(["\u201C", "\u201D", "\u2018", "\u2019"], ['"', '"', "'", "'"], $json);
            },
            function($json) {
                // Remove BOM if present
                return str_replace("\xEF\xBB\xBF", '', $json);
            }
        ];

        foreach ($repairStrategies as $index => $strategy) {
            $repairedJson = $strategy($jsonText);
            $quizData = json_decode($repairedJson, true);
            
            if (json_last_error() === JSON_ERROR_NONE && is_array($quizData)) {
                Log::info("JSON parsed successfully with repair strategy #{$index}");
                return $quizData;
            }
        }

        // Strategy 4: Try to fix by re-extracting and re-repairing
        $lastAttemptJson = $this->extractJson($generatedText);
        $lastAttemptJson = $this->repairCommonJsonIssues($lastAttemptJson);
        
        // Try one more aggressive fix: escape all unescaped quotes
        $lastAttemptJson = preg_replace('/(?<!\\\\)"(?=[^:,\[\]{}]*[^:,\[\]{}\s]")/s', '\\"', $lastAttemptJson);
        
        $quizData = json_decode($lastAttemptJson, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($quizData)) {
            Log::info('JSON parsed successfully with final aggressive repair');
            return $quizData;
        }

        // All strategies failed - provide user-friendly error
        $jsonError = json_last_error_msg();
        $decodedValue = json_decode($jsonText, true);
        
        // Log technical details for debugging
        Log::error('All JSON repair strategies failed', [
            'original_response' => substr($generatedText, 0, 2000),
            'cleaned_json' => substr($jsonText, 0, 2000),
            'json_error' => $jsonError
        ]);
        
        // Determine user-friendly message based on issue
        $responseLength = strlen($generatedText);
        
        if ($responseLength < 100) {
            // Very short response - likely empty or failed
            $userMessage = 'AI tidak dapat memproses dokumen Anda. Pastikan dokumen berisi materi pembelajaran yang jelas.';
        } elseif (str_contains($jsonError, 'Syntax error') || str_contains($jsonError, 'syntax')) {
            // Syntax error usually means truncated response
            $userMessage = 'Jumlah soal yang diminta terlalu banyak untuk dokumen ini. Coba kurangi jumlah soal menjadi 10-20 soal, atau gunakan dokumen yang lebih panjang.';
        } elseif (json_last_error() === JSON_ERROR_NONE && $decodedValue === null) {
            $userMessage = 'AI mengembalikan respons kosong. Silakan coba lagi atau gunakan dokumen dengan materi yang lebih lengkap.';
        } else {
            // Generic fallback
            $userMessage = 'Terjadi kesalahan saat memproses respons AI. Silakan coba lagi dengan jumlah soal yang lebih sedikit (5-15 soal).';
        }
        
        throw new Exception($userMessage);
    }

    /**
     * Build the prompt for quiz generation
     */
    private function buildPrompt(string $materialText, string $language, int $numberOfQuestions): string
    {
        $langInstruction = $language === 'id' 
            ? 'Gunakan Bahasa Indonesia untuk semua pertanyaan dan jawaban.'
            : 'Use English for all questions and answers.';

        return <<<PROMPT
You are a professional educational quiz generator AI assistant.

Your task is:
1. Analyze the learning material provided below.
2. The material language is: {$language} ({$langInstruction})
3. Generate a quiz using the SAME language as the material.

Quiz requirements:
- Number of questions: {$numberOfQuestions}
- Each question must be directly relevant to the material content.
- Difficulty level: Medium (comprehension and reasoning).
- Do NOT create questions outside the material context.

Quiz format:
- Each question must have:
  - Question text
  - 4 answer options (A, B, C, D)
  - 1 correct answer

Important rules:
- Do NOT mention or reference the document explicitly (e.g., "based on the text above").
- Do NOT add explanations, comments, or text outside the quiz.
- Do NOT repeat questions.
- Ensure correct answer distribution varies (not always A).

CRITICAL OUTPUT INSTRUCTIONS:
- Output ONLY valid JSON with NO markdown formatting
- Do NOT wrap the JSON in ```json or ``` code blocks
- Do NOT include any text before or after the JSON
- Do NOT add explanations or comments
- Ensure all strings are properly escaped
- Do NOT use trailing commas
- Return PURE JSON only

Output format (copy this structure exactly):

{
  "bahasa": "{$language}",
  "jumlah_soal": {$numberOfQuestions},
  "kuis": [
    {
      "no": 1,
      "pertanyaan": "...",
      "pilihan": {
        "A": "...",
        "B": "...",
        "C": "...",
        "D": "..."
      },
      "jawaban_benar": "A"
    }
  ]
}

Learning material:
{$materialText}

NOW GENERATE THE QUIZ AS PURE JSON (no markdown, no explanations, JUST the JSON object):
PROMPT;
    }

    /**
     * Extract and repair JSON from AI response (handles various edge cases)
     */
    private function extractJson(string $text): string
    {
        Log::info('Original AI response', ['response' => substr($text, 0, 500)]);
        
        // Step 1: Remove markdown code blocks (```json ... ``` or ``` ... ```)
        $text = preg_replace('/```json\s*/i', '', $text);
        $text = preg_replace('/```\s*$/s', '', $text);
        $text = preg_replace('/^```\s*/s', '', $text);
        
        // Step 2: Find JSON object boundaries
        // Try to extract JSON between first { and last }
        $firstBrace = strpos($text, '{');
        $lastBrace = strrpos($text, '}');
        
        if ($firstBrace !== false && $lastBrace !== false && $lastBrace > $firstBrace) {
            $text = substr($text, $firstBrace, $lastBrace - $firstBrace + 1);
        }
        
        // Step 3: Clean up common JSON syntax issues
        $text = $this->repairCommonJsonIssues($text);
        
        // Step 4: Trim whitespace
        $text = trim($text);
        
        Log::info('Cleaned JSON', ['json' => substr($text, 0, 500)]);
        
        return $text;
    }
    
    /**
     * Repair common JSON syntax issues
     */
    private function repairCommonJsonIssues(string $json): string
    {
        // Remove trailing commas before closing braces/brackets
        $json = preg_replace('/,\s*([\]}])/s', '$1', $json);
        
        // Remove any text before the first { or after the last }
        $json = preg_replace('/^[^{]*/', '', $json);
        $json = preg_replace('/[^}]*$/', '', $json);
        
        // Normalize line endings
        $json = str_replace(["\r\n", "\r"], "\n", $json);
        
        // Remove control characters except newlines and tabs
        $json = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $json);
        
        // Fix newlines inside string values (replace with space)
        // This is a common issue when AI includes line breaks in answers
        $json = preg_replace_callback('/"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"/s', function($matches) {
            // Replace actual newlines with escaped newlines or spaces
            return '"' . str_replace(["\n", "\r"], " ", $matches[1]) . '"';
        }, $json);
        
        // Fix double escaped backslashes
        $json = str_replace('\\\\\\\\', '\\\\', $json);
        
        // Remove JavaScript-style comments
        $json = preg_replace('/\/\/[^\n]*\n/', '', $json);
        $json = preg_replace('/\/\*.*?\*\//s', '', $json);
        
        // Fix missing quotes around keys (basic patterns)
        $json = preg_replace('/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/', '$1"$2":', $json);
        
        return $json;
    }

    /**
     * Validate quiz data structure
     */
    private function validateQuizStructure(array $quizData): void
    {
        if (!isset($quizData['bahasa']) || !isset($quizData['jumlah_soal']) || !isset($quizData['kuis'])) {
            throw new Exception('Invalid quiz structure: missing required fields (bahasa, jumlah_soal, kuis)');
        }

        if (!is_array($quizData['kuis']) || empty($quizData['kuis'])) {
            throw new Exception('Invalid quiz structure: kuis must be a non-empty array');
        }

        foreach ($quizData['kuis'] as $index => $question) {
            if (!isset($question['no']) || !isset($question['pertanyaan']) || 
                !isset($question['pilihan']) || !isset($question['jawaban_benar'])) {
                throw new Exception("Invalid question structure at index {$index}");
            }

            if (!isset($question['pilihan']['A']) || !isset($question['pilihan']['B']) ||
                !isset($question['pilihan']['C']) || !isset($question['pilihan']['D'])) {
                throw new Exception("Invalid options structure at question {$index}: must have A, B, C, D");
            }

            if (!in_array($question['jawaban_benar'], ['A', 'B', 'C', 'D'])) {
                throw new Exception("Invalid correct answer at question {$index}: must be A, B, C, or D");
            }
        }
    }
}
