<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommandsRequest;
use App\Http\Requests\UpdateCommandsRequest;
use App\Models\Commands;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CommandsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $commands = Commands::with(['client', 'products'])->latest()->get();

        return response()->json($commands);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCommandsRequest $request)
    {
        $data = $request->validated();

        $command = DB::transaction(function () use ($data) {
            $command = Commands::create([
                'client_id' => $data['client_id'],
                'status' => $data['status'] ?? 'pending',
                'total' => 0,
            ]);

            $total = $this->applyItems($command, $data['items']);

            $command->update(['total' => $total]);

            return $command;
        });

        return response()->json($command->load(['client', 'products']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        $command = Commands::with(['client', 'products'])->find($id);
        if (!$command) {
            return response()->json(['error' => 'Command not found'], 404);
        }

        return response()->json($command, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommandsRequest $request, int $id)
    {
        $command = Commands::find($id);
        if (!$command) {
            return response()->json(['error' => 'Command not found'], 404);
        }

        $data = $request->validated();

        $command = DB::transaction(function () use ($command, $data) {
            $command->update(array_filter([
                'client_id' => $data['client_id'] ?? null,
                'status' => $data['status'] ?? null,
            ], fn ($value) => $value !== null));

            if (isset($data['items'])) {
                // Put the previously reserved stock back, then re-apply the new items.
                $this->restoreStock($command);
                $command->products()->detach();

                $total = $this->applyItems($command, $data['items']);
                $command->update(['total' => $total]);
            }

            return $command;
        });

        return response()->json($command->load(['client', 'products']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $command = Commands::with('products')->find($id);
        if (!$command) {
            return response()->json(['error' => 'Command not found'], 404);
        }

        DB::transaction(function () use ($command) {
            $this->restoreStock($command);
            $command->delete();
        });

        return response()->json(['message' => 'Command deleted successfully'], 200);
    }

    /**
     * Attach the given items to a command: freeze the unit price, decrement the
     * product stock and return the command total.
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     */
    private function applyItems(Commands $command, array $items): float
    {
        $total = 0;

        foreach ($items as $item) {
            $product = Product::lockForUpdate()->find($item['product_id']);
            $quantity = $item['quantity'];

            if ($product->stock < $quantity) {
                throw ValidationException::withMessages([
                    'items' => "Stock insuffisant pour le produit \"{$product->name}\" (disponible: {$product->stock}, demandé: {$quantity}).",
                ]);
            }

            $command->products()->attach($product->id, [
                'quantity' => $quantity,
                'unit_price' => $product->price,
            ]);

            $product->stock -= $quantity;
            $product->status = $product->stock > 0 ? 'in stock' : 'out of stock';
            $product->save();

            $total += $quantity * $product->price;
        }

        return $total;
    }

    /**
     * Give back the stock reserved by a command's current items.
     */
    private function restoreStock(Commands $command): void
    {
        foreach ($command->products()->get() as $product) {
            $product->stock += $product->pivot->quantity;
            $product->status = $product->stock > 0 ? 'in stock' : 'out of stock';
            $product->save();
        }
    }
}
