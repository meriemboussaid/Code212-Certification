<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'certification_id' => 'required|integer|exists:certifications,id',
        ]);

        $user = $request->user();

        $dejaInscrit = Enrollment::where('user_id', $user->id)
            ->where('certification_id', $validated['certification_id'])
            ->exists();

        if ($dejaInscrit) {
            return response()->json([
                'message' => 'Vous êtes déjà inscrit à cette certification.',
            ], 422);
        }

        $totalInscriptions = Enrollment::where('user_id', $user->id)->count();

        if ($totalInscriptions >= 3) {
            return response()->json([
                'message' => 'Vous avez atteint le maximum de 3 inscriptions.',
            ], 422);
        }

        $enrollment = Enrollment::create([
            'user_id'          => $user->id,
            'certification_id' => $validated['certification_id'],
            'enrolled_at'      => now()->toDateString(),
        ]);

        return response()->json([
            'message'    => 'Inscription réussie.',
            'enrollment' => $enrollment->load('certification'),
        ], 201);
    }

    public function myEnrollments(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with('certification')
            ->get();

        return response()->json(['enrollments' => $enrollments]);
    }
}
