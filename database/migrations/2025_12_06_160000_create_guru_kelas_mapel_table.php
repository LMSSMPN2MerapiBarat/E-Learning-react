<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create new pivot table for guru-kelas-mapel relationship
        Schema::create('guru_kelas_mapel', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('gurus')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajarans')->onDelete('cascade');
            $table->timestamps();

            // Unique constraint to prevent duplicates
            $table->unique(['guru_id', 'kelas_id', 'mata_pelajaran_id'], 'guru_kelas_mapel_unique');
        });

        // Migrate existing data: for each guru, combine their kelas and mapel
        $guruKelasData = DB::table('guru_kelas')->get();
        $guruMapelData = DB::table('guru_mata_pelajaran')->get();

        // Group mapel by guru_id (guru_mata_pelajaran uses guru_id)
        $mapelByGuru = $guruMapelData->groupBy('guru_id');

        // Group kelas by user_id (guru_kelas uses user_id, need to map to guru_id)
        foreach ($guruKelasData as $gk) {
            // Get guru_id from user_id
            $guru = DB::table('gurus')->where('user_id', $gk->user_id)->first();
            if (!$guru) continue;

            $guruId = $guru->id;
            $kelasId = $gk->kelas_id;

            // Get all mapel for this guru
            $mapels = $mapelByGuru->get($guruId, collect());

            // Create entry for each mapel in this kelas
            foreach ($mapels as $mapel) {
                DB::table('guru_kelas_mapel')->insertOrIgnore([
                    'guru_id' => $guruId,
                    'kelas_id' => $kelasId,
                    'mata_pelajaran_id' => $mapel->mata_pelajaran_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('guru_kelas_mapel');
    }
};
