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

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile/photo', [AuthController::class, 'uploadPhoto']);
    Route::post('/enrollments', [EnrollmentController::class, 'store']);
    Route::get('/my-enrollments', [EnrollmentController::class, 'myEnrollments']);
    Route::get('/dashboard/student', [StudentController::class, 'dashboard']);
    
    // ✅ Déplacé ici : accessible à tout utilisateur connecté
    Route::get('/enrollments', [EnrollmentController::class, 'index']); 

    // Routes admin uniquement
    Route::middleware('isAdmin')->group(function () {
        Route::post('/certifications', [CertificationController::class, 'store']);
        Route::put('/certifications/{id}', [CertificationController::class, 'update']);
        Route::delete('/certifications/{id}', [CertificationController::class, 'destroy']);
        Route::post('/certifications/{id}/photo', [CertificationController::class, 'uploadPhoto']);
        Route::get('/dashboard/admin', [AdminController::class, 'dashboard']);
    });
});
