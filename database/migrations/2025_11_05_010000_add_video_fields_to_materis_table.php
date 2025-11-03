<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('materis', function (Blueprint $table) {
            $table->string('youtube_url')->nullable()->after('file_size');
            $table->string('video_path')->nullable()->after('youtube_url');
            $table->string('video_name')->nullable()->after('video_path');
            $table->string('video_mime')->nullable()->after('video_name');
            $table->unsignedBigInteger('video_size')->nullable()->after('video_mime');
        });
    }

    public function down(): void
    {
        Schema::table('materis', function (Blueprint $table) {
            $table->dropColumn([
                'youtube_url',
                'video_path',
                'video_name',
                'video_mime',
                'video_size',
            ]);
        });
    }
};
