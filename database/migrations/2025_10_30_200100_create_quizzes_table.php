<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')
                ->constrained('gurus')
                ->cascadeOnDelete();
            $table->foreignId('mata_pelajaran_id')
                ->nullable()
                ->constrained('mata_pelajarans')
                ->nullOnDelete();
            $table->string('judul');
            $table->string('deskripsi')->nullable();
            $table->unsignedInteger('durasi')->default(0);
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};

