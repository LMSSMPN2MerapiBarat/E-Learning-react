<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bank_materis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')
                ->constrained('gurus')
                ->cascadeOnDelete();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_mime')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->timestamps();

            $table->index('guru_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bank_materis');
    }
};
