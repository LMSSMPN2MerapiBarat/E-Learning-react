<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\AssignmentSubmission;
use Illuminate\Http\Request;

class AssignmentSubmissionController extends Controller
{
    public function update(Request $request, AssignmentSubmission $submission)
    {
        $guru = auth()->user()->guru()->firstOrFail();

        $submission->loadMissing('assignment');

        $assignment = $submission->assignment;

        abort_if(!$assignment || $assignment->guru_id !== $guru->id, 403);

        $maxScore = $assignment->max_score ?? 100;

        $validated = $request->validate([
            'score' => "required|integer|min:0|max:{$maxScore}",
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'score' => $validated['score'],
            'feedback' => $validated['feedback'] ?? null,
            'status' => 'graded',
            'graded_at' => now(),
        ]);

        return back()->with('success', 'Nilai tugas berhasil disimpan.');
    }
}
