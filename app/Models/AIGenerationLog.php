<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class AIGenerationLog extends Model
{
    use HasFactory;

    protected $table = 'ai_generation_logs'; // Explicitly set table name

    protected $fillable = [
        'user_id',
        'type',
        'questions_count',
        'model_used',
        'success',
        'error_message',
    ];

    protected $casts = [
        'success' => 'boolean',
        'questions_count' => 'integer',
    ];

    /**
     * Get the user that owns the log
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get today's logs
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    /**
     * Scope to get logs for a specific user
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to get successful generations only
     */
    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    /**
     * Get today's usage count for a user
     */
    public static function getTodayUsage(int $userId): int
    {
        return static::today()
            ->forUser($userId)
            ->successful()
            ->count();
    }

    /**
     * Check if user has reached daily limit
     */
    public static function hasReachedLimit(int $userId, int $limit = 50): bool
    {
        return static::getTodayUsage($userId) >= $limit;
    }

    /**
     * Get remaining quota for user
     */
    public static function getRemainingQuota(int $userId, int $limit = 50): int
    {
        $used = static::getTodayUsage($userId);
        return max(0, $limit - $used);
    }
}
