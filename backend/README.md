# Code212 Backend

Laravel API for the Code212 certification platform. It handles authentication, admin dashboards, certifications, student enrollments, and profile/certification photo uploads.

## Requirements

- PHP 8.1 or newer
- Composer
- MySQL running on `127.0.0.1:3306`
- Node.js and npm, only needed if you want to build Laravel frontend assets

## Setup

From the repository root:

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
```

Create a MySQL database named `code212`, then update `.env` if your local MySQL username or password is different:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=code212
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and seed demo data:

```bash
php artisan migrate --seed
php artisan storage:link
```

Start the backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

API base URL:

```text
http://127.0.0.1:8000/api
```

## Demo Accounts

All demo accounts use this password:

```text
password123
```

Admin:

```text
admin@code212.test
```

Students:

```text
sara@student.test
youssef@student.test
nadia@student.test
omar@student.test
```

## Seeded Data

The seeder creates:

- demo admin and student users
- sample certifications
- sample enrollments between students and certifications

You can rerun the seeder safely because it uses `updateOrCreate`:

```bash
php artisan db:seed --force
```

## Useful API Routes

Public:

```text
POST /api/register
POST /api/login
GET  /api/certifications
```

Authenticated:

```text
POST /api/logout
GET  /api/me
PUT  /api/profile
POST /api/profile/photo
POST /api/enrollments
GET  /api/my-enrollments
GET  /api/dashboard/student
GET  /api/dashboard/admin
POST /api/certifications
PUT  /api/certifications/{id}
DELETE /api/certifications/{id}
POST /api/certifications/{id}/photo
GET  /api/admin/enrollments
```

Protected routes require a Sanctum bearer token returned by `/api/login`.

## Notes

- Do not commit your real `.env` file. It is ignored by Git.
- Uploaded files are stored on the `public` disk, so run `php artisan storage:link`.
- The certification photo migration is idempotent, so it will not fail if the `photo` column already exists.
