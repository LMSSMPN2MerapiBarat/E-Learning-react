<?php

// Test Groq AI connection
// Run: php test-groq.php

$apiKey = 'YOUR_GROQ_API_KEY_HERE'; // Get from https://console.groq.com/
$model = 'llama-3.3-70b-versatile';
$url = "https://api.groq.com/openai/v1/chat/completions";

$data = [
    'model' => $model,
    'messages' => [
        [
            'role' => 'user',
            'content' => 'Say hello in Indonesian'
        ]
    ],
    'temperature' => 0.7,
    'max_tokens' => 100
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $apiKey,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: {$httpCode}\n";
echo "Response: {$response}\n\n";

if ($httpCode === 200) {
    $result = json_decode($response, true);
    $message = $result['choices'][0]['message']['content'] ?? '';
    echo "AI Response: {$message}\n\n";
    echo "✅ GROQ API KEY WORKS!\n";
} else {
    echo "❌ GROQ API KEY FAILED\n";
    echo "Please check:\n";
    echo "1. API key is correct\n";
    echo "2. API key is active at https://console.groq.com/\n";
}
