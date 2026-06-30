<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Commands;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommandsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Builds a handful of orders from the existing clients and products,
     * freezing the unit price, decrementing stock and computing the total,
     * just like CommandsController does at runtime.
     */
    public function run(): void
    {
        $clients = Client::all();
        if ($clients->isEmpty()) {
            return;
        }

        $statuses = ['pending', 'paid', 'shipped', 'cancelled'];

        for ($i = 0; $i < 8; $i++) {
            // Only products that still have stock can be ordered.
            $available = Product::where('stock', '>', 0)->get();
            if ($available->isEmpty()) {
                break;
            }

            $command = Commands::create([
                'client_id' => $clients->random()->id,
                'status' => $statuses[array_rand($statuses)],
                'total' => 0,
            ]);

            $picked = $available->shuffle()->take(rand(1, min(3, $available->count())));
            $total = 0;

            foreach ($picked as $product) {
                $quantity = rand(1, min(3, $product->stock));

                $command->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                ]);

                $product->stock -= $quantity;
                $product->status = $product->stock > 0 ? 'in stock' : 'out of stock';
                $product->save();

                $total += $quantity * $product->price;
            }

            $command->update(['total' => $total]);
        }
    }
}
