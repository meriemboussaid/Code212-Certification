<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $enrollments = Enrollment::where('user_id', $user->id)
            ->with('certification')
            ->get();

        $total = $enrollments->count();

        return response()->json([
            'user'             => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
            'enrollments'      => $enrollments,
            'total_enrollments' => $total,
            'remaining_slots'  => 3 - $total,
        ]);
    }
}
