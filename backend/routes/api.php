<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificationController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// --------------------------------------------------------------------
// Routes Publiques
// --------------------------------------------------------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/certifications', [CertificationController::class, 'index']);

// --------------------------------------------------------------------
// Routes Protégées (Utilisateurs connectés)
// --------------------------------------------------------------------
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth & Profil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/photo', [AuthController::class, 'uploadPhoto']);
    
    // Espace Étudiant
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/dashboard/student', [StudentController::class, 'dashboard']);
    
    // ----------------------------------------------------------------
    // Routes Admin uniquement (via le middleware isAdmin)
    // ----------------------------------------------------------------
    Route::middleware('isAdmin')->group(function () {
        // Nouvelle URL propre pour l'admin, sans conflit
        Route::get('/admin/enrollments', [EnrollmentController::class, 'index']); 

        // Gestion des certifications
        Route::post('/certifications', [CertificationController::class, 'store']);
        Route::put('/certifications/{id}', [CertificationController::class, 'update']);
        Route::delete('/certifications/{id}', [CertificationController::class, 'destroy']);
        Route::post('/certifications/{id}/photo', [CertificationController::class, 'uploadPhoto']);
        
        // Dashboard Admin
        Route::get('/dashboard/admin', [AdminController::class, 'dashboard']);
    });
    
});
