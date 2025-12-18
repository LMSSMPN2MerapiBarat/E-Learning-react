<?php

namespace Database\Factories;

use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kelas>
 */
class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tingkat' => fake()->randomElement(['VII', 'VIII', 'IX']),
            'kelas' => fake()->randomElement(['A', 'B', 'C', 'D']),
            'tahun_ajaran' => '2024/2025',
            'deskripsi' => fake()->sentence(),
        ];
    }
}
