<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/certifications', [CertificationController::class, 'index']);

// Routes protégées (Utilisateurs connectés)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/photo', [AuthController::class, 'uploadPhoto']);
    
    // Un étudiant s'inscrit ou voit SES propres inscriptions
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/dashboard/student', [StudentController::class, 'dashboard']);
    
    // Routes admin uniquement
    Route::middleware('isAdmin')->group(function () {
        // ✅ PLACÉ ICI : Seuls les admins peuvent voir TOUTES les inscriptions (DashboardAdmin)
        Route::get('/enrollments', [EnrollmentController::class, 'index']); 

        Route::post('/certifications', [CertificationController::class, 'store']);
        Route::put('/certifications/{id}', [CertificationController::class, 'update']);
        Route::delete('/certifications/{id}', [CertificationController::class, 'destroy']);
        Route::post('/certifications/{id}/photo', [CertificationController::class, 'uploadPhoto']);
        Route::get('/dashboard/admin', [AdminController::class, 'dashboard']);
    });
});
