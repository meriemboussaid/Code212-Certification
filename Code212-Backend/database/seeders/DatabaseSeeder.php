<?php

namespace Database\Seeders;

use App\Models\Certification;
use App\Models\Enrollment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@code212.test'],
            [
                'name' => 'Admin Code212',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        $students = collect([
            ['name' => 'Sara El Mansouri', 'email' => 'sara@student.test'],
            ['name' => 'Youssef Benali', 'email' => 'youssef@student.test'],
            ['name' => 'Nadia Amrani', 'email' => 'nadia@student.test'],
            ['name' => 'Omar Alaoui', 'email' => 'omar@student.test'],
        ])->map(fn (array $student) => User::updateOrCreate(
            ['email' => $student['email']],
            [
                'name' => $student['name'],
                'password' => Hash::make('password123'),
                'role' => 'student',
            ]
        ));

        $certifications = collect([
            [
                'titre' => 'React Developer',
                'description' => 'Bases solides de React, composants, hooks, routes et appels API.',
                'date_debut' => '2026-05-12',
                'date_fin' => '2026-06-12',
            ],
            [
                'titre' => 'Laravel API',
                'description' => 'Creation d APIs REST avec Laravel, Sanctum, migrations et seeders.',
                'date_debut' => '2026-05-20',
                'date_fin' => '2026-06-25',
            ],
            [
                'titre' => 'Database Fundamentals',
                'description' => 'Modelisation, relations SQL, requetes, migrations et bonnes pratiques.',
                'date_debut' => '2026-06-01',
                'date_fin' => '2026-06-30',
            ],
            [
                'titre' => 'Full Stack Project',
                'description' => 'Projet final combinant frontend React, backend Laravel et integration API.',
                'date_debut' => '2026-07-01',
                'date_fin' => '2026-08-15',
            ],
        ])->map(fn (array $certification) => Certification::updateOrCreate(
            ['titre' => $certification['titre']],
            $certification
        ));

        $enrollments = [
            ['student' => 0, 'certification' => 0, 'days_ago' => 8],
            ['student' => 0, 'certification' => 1, 'days_ago' => 4],
            ['student' => 1, 'certification' => 1, 'days_ago' => 10],
            ['student' => 1, 'certification' => 2, 'days_ago' => 3],
            ['student' => 2, 'certification' => 0, 'days_ago' => 6],
            ['student' => 2, 'certification' => 3, 'days_ago' => 1],
            ['student' => 3, 'certification' => 2, 'days_ago' => 5],
        ];

        foreach ($enrollments as $enrollment) {
            Enrollment::updateOrCreate(
                [
                    'user_id' => $students[$enrollment['student']]->id,
                    'certification_id' => $certifications[$enrollment['certification']]->id,
                ],
                ['enrolled_at' => Carbon::today()->subDays($enrollment['days_ago'])]
            );
        }
    }
}
