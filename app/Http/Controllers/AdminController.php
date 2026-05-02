<?php

namespace App\Http\Controllers;

use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        $students = User::where('role', 'student')
            ->with(['enrollments.certification'])
            ->get();

        return response()->json([
            'total_students' => $students->count(),
            'students'       => $students,
        ]);
    }
}
