<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Commands;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Commands>
 */
class CommandsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'status' => fake()->randomElement(['pending', 'paid', 'shipped', 'cancelled']),
            'total' => 0,
        ];
    }
}
