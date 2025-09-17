# TaskFlow — Full Stack Project

TaskFlow is a friendly, full-stack task management system with a modern React frontend and a Django backend. This documentation will help new developers set up, run, and understand the entire project from start to finish.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
  - [Features](#frontend-features)
  - [Requirements](#frontend-requirements)
  - [Setup & Installation](#frontend-setup--installation)
  - [Scripts](#frontend-scripts)
  - [Usage Notes](#frontend-usage-notes)
- [Backend](#backend)
  - [Features](#backend-features)
  - [Requirements](#backend-requirements)
  - [Setup & Installation](#backend-setup--installation)
  - [API Endpoints](#api-endpoints)
  - [Frontend Integration](#frontend-integration)
  - [Development Notes](#backend-development-notes)
  - [Scripts](#backend-scripts)
- [License](#license)

---

## Tech Stack

### Frontend
- React 18 + Vite
- JavaScript (JSX)
- Tailwind CSS (with tailwindcss-animate)
- Radix UI (shadcn-style components)
- React Router DOM
- TanStack Query (React Query)
- Recharts

### Backend
- Django 5.x
- Django REST Framework
- PostgreSQL

---

## Project Structure

- `frontend/` — React app (see `src/` for components, pages, hooks, etc.)
- `backend/` — Django project (apps: analytics, tasks, users)

---

## Frontend

### Frontend Features
- Modern, approachable UI for task management
- Kanban board, backlog, sprints, reports, and analytics
- Responsive design with dark mode
- Toast notifications, charts, and reusable UI components

### Frontend Requirements
- Node.js 18+
- npm

### Frontend Setup & Installation
1. Navigate to the `frontend/` directory (if not already there).
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   - App runs at: http://localhost:8080
4. Build for production:
   ```sh
   npm run build
   ```
5. Preview the production build:
   ```sh
   npm run preview
   ```
6. Lint the project:
   ```sh
   npm run lint
   ```

### Frontend Scripts
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Lint code

### Frontend Usage Notes
- Uses alias `@` for `./src` (e.g., `import { Button } from "@/components/ui/button";`)
- Tailwind and PostCSS configured for styling
- Toast system and charts are available out of the box
- See `src/` for main app code, pages, and components

---

## Backend

### Backend Features
- Django 5.x project with REST API
- PostgreSQL integration
- API endpoints for tasks, users, analytics
- CORS enabled for frontend integration

### Backend Requirements
- Python 3.12+
- pip
- PostgreSQL

### Backend Setup & Installation
1. Navigate to the `backend/` directory.
2. (Recommended) Create and activate a virtual environment:
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   source .venv/bin/activate  # On macOS/Linux
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Configure PostgreSQL credentials in `backend/settings.py`.
5. Run migrations:
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start the server:
   ```sh
   python manage.py runserver
   ```

### API Endpoints
- `/api/tasks/` — Task management
- `/api/users/` — User profiles
- `/api/analytics/` — Analytics records

### Frontend Integration
Connect your React frontend to these endpoints using fetch or axios. Ensure CORS is enabled for local development.

### Backend Development Notes
- For production, use a secure PostgreSQL password and configure allowed hosts in Django settings.
- See `.github/copilot-instructions.md` for workspace automation details (if present).

### Backend Scripts
- `python manage.py runserver` — Start backend server
- `python manage.py makemigrations` — Create new migrations
- `python manage.py migrate` — Apply migrations

---

## License
MIT