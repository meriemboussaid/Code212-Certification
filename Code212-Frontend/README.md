# Code212 Frontend

React + Vite frontend for the Code212 certification platform.

The frontend talks to the Laravel API running at:

```text
http://localhost:8000/api
```

## Requirements

- Node.js
- npm
- The backend running from `../Code212-Backend`

## Setup

From the workspace root:

```bash
cd Code212-Frontend
npm install
npm run dev
```

Vite usually starts the app at:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Main Features

- Public login and registration pages
- Student dashboard
- Student certification browsing and enrollment
- Student profile page with profile photo upload
- Admin dashboard
- Admin certification management
- Admin certification photo upload
- Admin student enrollment table

## Photo Uploads

The frontend accepts image files for:

- student profile photos on `Mon profil`
- certification photos in admin certification create/edit

The backend stores only the photo path in the database. The frontend converts paths such as:

```text
photos/users/example.jpg
photos/certifications/example.jpg
```

into browser URLs under:

```text
http://localhost:8000/storage/...
```

For images to display, the backend must have its Laravel storage link:

```bash
cd ../Code212-Backend
php artisan storage:link
```

## Recent Cleanup

- Removed the unfinished `SaisieNotes` page and `/admin/notes` route.
- Removed the `Note` column from the admin student management table.
- Fixed the student navbar role check so users with the backend role `student` see `Mon profil`.
