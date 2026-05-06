# Code212 Frontend

React + Vite frontend for the Code212 certification platform. It connects to the Laravel backend API and provides public auth pages, student pages, and admin management screens.

## Requirements

- Node.js
- npm
- Backend API running at `http://127.0.0.1:8000/api`

## Setup

```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## API Configuration

The Axios API client is here:

```text
src/services/api.js
```

Current API base URL:

```text
http://localhost:8000/api
```

If your backend is running on the explicit loopback address, you can change it to:

```text
http://127.0.0.1:8000/api
```

## Demo Logins

Run the backend seeder first:

```bash
cd ../backend
php artisan migrate --seed
```

All seeded accounts use:

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

## Main Screens

- Login and registration
- Student dashboard
- Student certifications
- Student profile
- Admin dashboard
- Certification management
- Student management
- Enrollment and grade management

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Full Local Run

Terminal 1:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2:

```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
