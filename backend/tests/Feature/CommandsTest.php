<?php

use App\Models\Category;
use App\Models\Client;
use App\Models\Commands;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

function makeProduct(int $stock = 10, float $price = 100): Product
{
    $category = Category::factory()->create();

    return Product::factory()->create([
        'category_id' => $category->id,
        'stock' => $stock,
        'price' => $price,
        'status' => 'in stock',
    ]);
}

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

it('creates a command with several products, freezes prices and decrements stock', function () {
    $client = Client::factory()->create();
    $p1 = makeProduct(stock: 10, price: 50);
    $p2 = makeProduct(stock: 5, price: 20);

    $response = $this->postJson('/api/commands', [
        'client_id' => $client->id,
        'items' => [
            ['product_id' => $p1->id, 'quantity' => 2],
            ['product_id' => $p2->id, 'quantity' => 3],
        ],
    ]);

    $response->assertCreated();

    // total = 2*50 + 3*20 = 160
    expect((float) $response->json('total'))->toBe(160.0);

    // stock decremented
    expect($p1->fresh()->stock)->toBe(8);
    expect($p2->fresh()->stock)->toBe(2);

    // pivot stores quantity + frozen unit_price
    $this->assertDatabaseHas('command_product', [
        'product_id' => $p1->id,
        'quantity' => 2,
        'unit_price' => 50,
    ]);
});

it('flips a product to out of stock when fully ordered', function () {
    $client = Client::factory()->create();
    $product = makeProduct(stock: 3, price: 10);

    $this->postJson('/api/commands', [
        'client_id' => $client->id,
        'items' => [['product_id' => $product->id, 'quantity' => 3]],
    ])->assertCreated();

    expect($product->fresh()->stock)->toBe(0);
    expect($product->fresh()->status)->toBe('out of stock');
});

it('rejects a command when stock is insufficient and rolls back', function () {
    $client = Client::factory()->create();
    $product = makeProduct(stock: 2, price: 10);

    $this->postJson('/api/commands', [
        'client_id' => $client->id,
        'items' => [['product_id' => $product->id, 'quantity' => 5]],
    ])->assertStatus(422);

    // nothing persisted, stock untouched
    expect(Commands::count())->toBe(0);
    expect($product->fresh()->stock)->toBe(2);
});

it('restores stock when a command is deleted', function () {
    $client = Client::factory()->create();
    $product = makeProduct(stock: 10, price: 10);

    $id = $this->postJson('/api/commands', [
        'client_id' => $client->id,
        'items' => [['product_id' => $product->id, 'quantity' => 4]],
    ])->json('id');

    expect($product->fresh()->stock)->toBe(6);

    $this->deleteJson("/api/commands/{$id}")->assertOk();

    expect($product->fresh()->stock)->toBe(10);
    expect(Commands::count())->toBe(0);
});

it('requires authentication', function () {
    app()['auth']->forgetGuards();

    $this->postJson('/api/commands', [])->assertUnauthorized();
});

it('seeds consistent commands (total matches items, stock stays valid)', function () {
    $this->seed();

    expect(Commands::count())->toBeGreaterThan(0);

    Commands::with('products')->get()->each(function ($command) {
        $expected = $command->products->sum(
            fn ($product) => $product->pivot->quantity * $product->pivot->unit_price,
        );
        expect((float) $command->total)->toBe((float) $expected);
    });

    expect(Product::where('stock', '<', 0)->count())->toBe(0);
});
