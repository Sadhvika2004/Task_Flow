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

- `src/` — React frontend source code (components, pages, hooks, etc.)
- `backend/` — Django backend project (apps: analytics, tasks, users)
- `public/` — Static assets for the React app

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
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
   - App runs at: http://localhost:8080
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview the production build:
   ```sh
   npm run preview
   ```
5. Lint the project:
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
- PostgreSQL (with database named 'taskflow_db' and user 'postgres')

### Backend Setup & Installation
1. Navigate to the `backend/` directory.
2. Activate the existing virtual environment:
   ```sh
   .venv\Scripts\Activate.ps1  # On Windows PowerShell
   .venv\Scripts\activate.bat  # On Windows Command Prompt
   source .venv/bin/activate   # On macOS/Linux
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Set up PostgreSQL database:
   - Ensure PostgreSQL is running
   - Create database named 'taskflow_db'
   - Create user 'postgres' with appropriate permissions
   - Update database credentials in `backend/settings.py` if needed
5. Run migrations:
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```
6. Start the server:
   ```sh
   python manage.py runserver
   ```
   - API runs at: http://127.0.0.1:8000

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

## Running the Full Project

To run both frontend and backend simultaneously:

### Option 1: Manual Setup
1. **Terminal 1 - Frontend:**
   ```sh
   cd /path/to/project
   npm install
   npm run dev
   ```
   - Frontend runs at: http://localhost:8080

2. **Terminal 2 - Backend:**
   ```sh
   cd backend/
   .venv\Scripts\Activate.ps1  # Windows PowerShell
   pip install -r requirements.txt
   python manage.py runserver
   ```
   - Backend runs at: http://127.0.0.1:8000

### Option 2: Using Scripts (Recommended)
Create the following scripts in your project root:

**run-frontend.bat** (Windows):
```batch
@echo off
npm install
npm run dev
```

**run-backend.bat** (Windows):
```batch
@echo off
cd backend
.venv\Scripts\activate.bat
pip install -r requirements.txt
python manage.py runserver
```

Then run both scripts in separate terminals.

---

## License
MIT