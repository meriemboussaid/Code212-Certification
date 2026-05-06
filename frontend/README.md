# Code212 Frontend

React + Vite frontend for the Code212 certification platform.

## Requirements

- Node.js
- npm
- Backend API running at `http://127.0.0.1:8000/api`

## Setup

If the frontend source is in this folder:

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

The frontend API client is configured in:

```text
src/services/api.js
```

Expected API base URL:

```text
http://localhost:8000/api
```

If needed, change it to:

```text
http://127.0.0.1:8000/api
```

## Demo Logins

Use the seeded backend accounts.

Admin:

```text
admin@code212.test
password123
```

Student:

```text
sara@student.test
password123
```

Other seeded student emails:

```text
youssef@student.test
nadia@student.test
omar@student.test
```

## Main Screens

- public login and register pages
- student dashboard
- student certifications page
- student profile page
- admin dashboard
- admin certification management
- admin student management
- admin grade/enrollment management

## Working With Split Branches

This repository has separate remote branches for the app parts:

```bash
git checkout backend
git checkout frontend
```

If you want to run the frontend without switching your current branch, create a detached worktree:

```bash
git worktree add --detach ../Code212-Frontend-Run origin/frontend
cd ../Code212-Frontend-Run/frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
