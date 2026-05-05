<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EnrollmentController;

Route::get('/', function () {
    return view('welcome');
});

// 🚀 LE COUP DE GRÂCE : On force la route ici !
Route::get('api/admin/enrollments', [EnrollmentController::class, 'index'])->middleware('auth:sanctum');
