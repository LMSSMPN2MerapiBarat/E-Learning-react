<?php

namespace Database\Factories;

use App\Models\Guru;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Guru>
 */
class GuruFactory extends Factory
{
    protected $model = Guru::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->guru(),
            'nip' => fake()->numerify('##################'),
            'mapel' => fake()->randomElement(['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Indonesia']),
            'no_telp' => fake()->numerify('08##########'),
        ];
    }
}
