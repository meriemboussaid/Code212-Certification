<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// 1. Routes Publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/certifications', [CertificationController::class, 'index']);

// 2. Routes Protégées par Auth (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentification & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/photo', [AuthController::class, 'uploadPhoto']);
    
    // Espace Étudiant
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/dashboard/student', [StudentController::class, 'dashboard']);
    
    // Espace Administration Global
    Route::get('/dashboard/admin', [AdminController::class, 'dashboard']);
    Route::post('/certifications', [CertificationController::class, 'store']);
    Route::put('/certifications/{id}', [CertificationController::class, 'update']);
    Route::delete('/certifications/{id}', [CertificationController::class, 'destroy']);
    Route::post('/certifications/{id}/photo', [CertificationController::class, 'uploadPhoto']);
    
    // ✅ LA ROUTE DE LA DÉLIVRANCE : Placée ici pour s'assurer qu'elle monte !
    Route::get('/admin/enrollments', [EnrollmentController::class, 'index']);
});
