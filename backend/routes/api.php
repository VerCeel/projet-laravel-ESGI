<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommandsController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;


Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working 🚀'
    ]);
});

Route::apiResource('posts', PostController::class);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('commands', CommandsController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
});
