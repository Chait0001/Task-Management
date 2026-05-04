# TASKX — Task Management System

A full-stack task management application built with a strictly encapsulated Object-Oriented Programming (OOP) architecture. Create, prioritize, filter, and track tasks through a modern glassmorphism interface with light/dark theme support — powered by React, TypeScript, and Express.js.

Built as part of a Software Design and Software Engineering (SDSE) project to demonstrate core OOP principles in a real-world web application.

---

## Live Demo

Frontend: https://task-management-five-weld.vercel.app  
Backend API: https://task-management-jvt3.vercel.app/api/tasks

---

## Features

- Create tasks with a title, description, priority level (Low / Medium / High), and deadline
- View all tasks in a clean, modern glassmorphism interface
- Filter tasks by status: All, Pending, In Progress, Completed, or Overdue
- Mark tasks as complete or update their status through a progress chip
- Delete tasks that are no longer needed
- Automatic overdue detection — tasks past their deadline are flagged automatically
- Focus Mode — enter a fullscreen Pomodoro timer for any task; sessions are recorded and shown as a tomato badge on each card
- Smart deadline input — type natural language like "tomorrow", "next Monday", or "in 3 days" instead of using a date picker
- Task dependencies — link tasks as blockers; a task cannot be completed until all its dependencies are resolved
- Productivity score — calculated from completed Pomodoro sessions, weighted by task priority
- Inline task editing — edit title, description, and priority directly on the card
- Tag and label support — colour-coded tags for categorisation
- Bulk actions — select multiple tasks and mark complete or delete in one action
- Dark / light theme toggle with preference persisted in localStorage
- Canvas-based animated dot background that adapts to the active theme
- Fully responsive layout

---

## OOP Principles Demonstrated

| Principle | Implementation |
|---|---|
| Encapsulation | All model fields are private with controlled access via methods (`Task`, `User`, `Project`, `Tag`, `PomodoroSession`) |
| Singleton Pattern | `TaskManager`, `FocusSessionService`, `NotificationService`, and `DependencyGraph` each use a single shared instance via `getInstance()` |
| Aggregation | `Project` contains a collection of `Task` objects (HAS-A relationship) |
| Separation of Concerns | Controller handles the HTTP layer, Service handles business logic, Models hold data and behaviour |
| DTO Mapping | Internal objects are mapped to plain DTOs before API responses to avoid leaking internal state |
| Strategy Pattern | `DateParser` class encapsulates natural language date parsing as interchangeable static methods |
| Observer-like Notification | `NotificationService` acts as an append-only event log, notified by `TaskManager` on every state change |

---

## Tech Stack

**Backend**  
- Runtime: Node.js  
- Framework: Express.js v5  
- Language: TypeScript  
- Database: MongoDB with Mongoose  
- Architecture: MVC + Service Layer  
- Dev tools: Nodemon + ts-node  

**Frontend**  
- Framework: React 18  
- Build tool: Vite  
- Language: TypeScript  
- Styling: Tailwind CSS v4  
- Animation: Framer Motion  
- Data fetching: TanStack Query (React Query)  
- HTTP client: Axios  

---

## Project Structure

```
Task-Management/
├── backend/
│   └── src/
│       ├── server.ts
│       ├── controllers/
│       │   ├── TaskController.ts
│       │   ├── FocusController.ts
│       │   └── DependencyController.ts
│       ├── services/
│       │   ├── TaskManager.ts          (Singleton)
│       │   ├── FocusSessionService.ts  (Singleton)
│       │   ├── DependencyGraph.ts      (Singleton)
│       │   └── NotificationService.ts  (Singleton)
│       ├── models/
│       │   ├── Task.ts
│       │   ├── Project.ts
│       │   ├── User.ts
│       │   ├── Tag.ts
│       │   └── PomodoroSession.ts
│       └── routes/
│           └── taskRoutes.ts
│
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── components/
│       │   ├── TaskForm.tsx
│       │   ├── TaskList.tsx
│       │   ├── FocusModeOverlay.tsx
│       │   ├── TaskDrawer.tsx
│       │   ├── StatsCard.tsx
│       │   ├── SmartDeadlineInput.tsx
│       │   └── glass/
│       │       └── GlassTaskCard.tsx
│       ├── hooks/
│       │   └── useFocusMode.ts
│       ├── lib/
│       │   ├── PomodoroTimer.ts        (pure TS class)
│       │   └── DateParser.ts           (pure TS class)
│       ├── api/
│       │   └── apiClient.ts
│       └── models/
│           └── types.ts
│
├── docs/
│   ├── er_diagram.md
│   ├── class_diagram.md
│   ├── sequence_diagram.md
│   └── use_case_diagram.md
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/tasks | Fetch all tasks (optional ?status=Pending\|Completed\|Overdue) |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/:id | Update task fields |
| PATCH | /api/tasks/:id/complete | Mark a task as completed |
| PATCH | /api/tasks/:id/status | Update task status |
| DELETE | /api/tasks/:id | Delete a task |
| GET | /api/stats | Get task counts and productivity score |
| POST | /api/focus/start | Start a Pomodoro session |
| PATCH | /api/focus/:id/complete | Complete a Pomodoro session |
| PATCH | /api/focus/:id/abandon | Abandon a Pomodoro session |
| GET | /api/focus/stats | Get productivity score and per-task pomodoro counts |
| POST | /api/dependencies/add | Add a task dependency |
| POST | /api/dependencies/remove | Remove a task dependency |
| GET | /api/dependencies/blocked/:taskId | Check if a task is blocked |
| GET | /api/tags | Fetch all tags |
| POST | /api/tags | Create a tag |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm
- A MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/Chait0001/Task-Management.git
cd Task-Management

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

Create `backend/.env`:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskmanager
PORT=4000
FRONTEND_URL=http://localhost:3001
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:4000/api
```

### Running Locally

```bash
# Start backend (from /backend)
npx nodemon --exec ts-node src/server.ts

# Start frontend (from /frontend)
npm run dev
```

Backend runs at `http://localhost:4000`  
Frontend runs at `http://localhost:3001`

---

## Deployment (Vercel)

This is a monorepo — deploy backend and frontend as two separate Vercel projects.

**Backend**
1. Go to vercel.com → New Project → Import this repo
2. Set Root Directory to `backend`
3. Add environment variable: `MONGODB_URI` = your Atlas connection string
4. Add environment variable: `FRONTEND_URL` = your frontend Vercel URL
5. Deploy

**Frontend**
1. Go to vercel.com → New Project → Import this repo again
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_API_URL` = `https://<your-backend>.vercel.app/api`
4. Deploy

After both are deployed, update `FRONTEND_URL` in the backend project to the real frontend URL and redeploy the backend.

---

## System Diagrams

All diagrams are in the `/docs` folder:
- `er_diagram.md` — Entity relationship diagram (crow's foot notation)
- `class_diagram.md` — Full class diagram with method signatures
- `sequence_diagram.md` — Sequence diagrams for create, complete, and focus mode flows
- `use_case_diagram.md` — Use case diagram with actor and system boundaries

---

## Contributors

- Chaitanya Kumar
- Aaryan Gera
- Archit Gosain
- Garv Verma
- M. S. Thejas
