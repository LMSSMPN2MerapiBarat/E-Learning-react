<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('gurus')->cascadeOnDelete();
            $table->foreignId('mata_pelajaran_id')->nullable()->constrained('mata_pelajarans')->nullOnDelete();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->dateTime('dibuka_pada');
            $table->dateTime('ditutup_pada');
            $table->unsignedSmallInteger('max_score');
            $table->unsignedSmallInteger('passing_grade')->nullable();
            $table->boolean('allow_text_answer')->default(true);
            $table->boolean('allow_file_upload')->default(true);
            $table->json('allowed_file_types')->nullable();
            $table->boolean('allow_cancel_submit')->default(true);
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};
