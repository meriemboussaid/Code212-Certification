<?php

namespace App\Http\Controllers;

use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CertificationController extends Controller
{
    public function index()
    {
        return response()->json(Certification::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'duration'    => 'required|string|max:100',
        ]);

        $certification = Certification::create($validated);

        return response()->json($certification, 201);
    }

    public function update(Request $request, $id)
    {
        $certification = Certification::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'duration'    => 'sometimes|string|max:100',
        ]);

        $certification->update($validated);

        return response()->json($certification);
    }

    public function destroy($id)
    {
        $certification = Certification::findOrFail($id);
        $certification->delete();

        return response()->json(['message' => 'Certification supprimée.']);
    }

    public function uploadPhoto(Request $request, $id)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $certification = Certification::findOrFail($id);

        if ($certification->photo) {
            Storage::disk('public')->delete($certification->photo);
        }

        $path = $request->file('photo')->store('photos/certifications', 'public');
        $certification->update(['photo' => $path]);

        return response()->json([
            'message' => 'Photo mise à jour.',
            'photo'   => asset('storage/' . $path),
        ]);
    }
}
