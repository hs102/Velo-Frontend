# Velo - Task Manager

A modern React-based task and project management application with AI-powered chat assistance.

## Overview

Velo is a full-stack web application that helps teams organize projects and tasks efficiently. Features include user authentication, project/task CRUD operations, advanced filtering, and an integrated AI chatbot for intelligent assistance.

## Tech Stack

**Frontend:**
- React 18 (Hooks & Context API)
- React Router DOM v6
- Axios for API calls
- CSS Modules for styling
- React Markdown for chatbot responses

**Backend:**
- FastAPI (Python)
- PostgreSQL database
- JWT authentication
- LLM integration for AI chat

## Key Features

- Authentication - Secure JWT-based login/register
- Projects - Create, edit, delete projects with custom colors
- Tasks - Full CRUD with priority, status, and due dates
- Filtering - Search and filter by project, status, priority
- AI Chatbot - Context-aware assistant for project/task queries
- Profile Management - Update user credentials and password
- Responsive Design - Mobile-friendly UI

## Database Schema

### ERD Diagram

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ password    │
│ created_at  │
└──────┬──────┘
       │
       │ 1:N
       ├─────────────────────┐
       │                     │
       ▼                     ▼
┌─────────────────┐  ┌──────────────────┐
│   Projects      │  │      Tasks       │
├─────────────────┤  ├──────────────────┤
│ id (PK)         │  │ id (PK)          │
│ name            │  │ title            │
│ description     │  │ description      │
│ color           │  │ status           │
│ user_id (FK)    │  │ priority         │
│ created_at      │  │ due_date         │
└────────┬────────┘  │ project_id (FK)  │
         │           │ user_id (FK)     │
         │           │ created_at       │
         │           └──────────────────┘
         │                   ▲
         └───────────────────┘
              1:N
```

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- created_at
```

### Projects Table
```sql
- id (Primary Key)
- name
- description
- color (Hex color code)
- user_id (Foreign Key → Users)
- created_at
```

### Tasks Table
```sql
- id (Primary Key)
- title
- description
- status (todo, in_progress, completed)
- priority (low, medium, high)
- due_date
- project_id (Foreign Key → Projects)
- user_id (Foreign Key → Users)
- created_at
```

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Overview with stats and recent items |
| `/login` | Login | User authentication |
| `/register` | Register | New user signup |
| `/projects` | Projects | Project list and management |
| `/projects/:id` | ProjectDetail | Single project view |
| `/tasks` | Tasks | Task list with filters |
| `/profile` | Profile | User settings and password change |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Projects
- `GET /api/projects/` - List user's projects
- `POST /api/projects/` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks/` - List tasks (supports filtering)
- `POST /api/tasks/` - Create new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### AI Chatbot
- `POST /api/ai/chat` - Send message to AI assistant
  - Accepts: `{ message: string, context: { projects, tasks } }`
  - Returns: AI-generated response with markdown support

## AI Chatbot

The integrated chatbot uses a Large Language Model (LLM) to provide intelligent assistance:
- **Context-Aware**: Has access to user's projects and tasks
- **Markdown Support**: Responses formatted with lists, code blocks, and emphasis
- **Floating Interface**: Accessible from all pages via bottom-right button
- **Conversation History**: Maintains chat context during session




## Project Structure

```
src/
├── components/
│   ├── Auth/          # Login, Register
│   ├── ChatBot/       # AI chat interface
│   ├── Common/        # Button, Modal, Loader
│   ├── Layout/        # Navbar, Sidebar
│   ├── Projects/      # Project components
│   └── Tasks/         # Task components
├── context/           # AuthContext, DataContext
├── hooks/             # useAuth, useProjects, useTasks
├── pages/             # Page-level components
├── services/          # API service layer
├── styles/            # CSS Modules
└── utils/             # Validators, formatters
```


## Wireframes

### Login Page
```
┌────────────────────────────────────┐
│                                    │
│          [Velo Logo]               │
│                                    │
│       Welcome to Velo              │
│   Sign in to your account          │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Username or Email        │    │
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Password                 │    │
│   └──────────────────────────┘    │
│                                    │
│   [ ] Remember me                  │
│                                    │
│   ┌──────────────────────────┐    │
│   │      Sign In             │    │
│   └──────────────────────────┘    │
│                                    │
│   Don't have an account? Register  │
│                                    │
└────────────────────────────────────┘
```

### Dashboard Page
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Velo              [User Avatar] ▼ [Logout]       │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ MENU     │  Dashboard                                    │
│          │                                               │
│ Dashboard│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐        │
│ Projects │  │  10  │ │  25  │ │  15  │ │   5  │        │
│ Tasks    │  │Projects Tasks │ │Completed Overdue│        │
│ Profile  │  └──────┘ └──────┘ └──────┘ └──────┘        │
│          │                                               │
│ Overview │  Recent Projects                              │
│ 10 Proj  │  ┌────────────────────────────┐              │
│ 25 Tasks │  │ Project 1  [Edit] [Delete] │              │
│ 15 Done  │  │ 5 tasks                    │              │
│  5 Late  │  └────────────────────────────┘              │
│          │  ┌────────────────────────────┐              │
│          │  │ Project 2  [Edit] [Delete] │              │
│          │  │ 3 tasks                    │              │
│          │  └────────────────────────────┘              │
│          │                                               │
│          │  Upcoming Tasks                               │
│          │  □ Task 1 - Due: Tomorrow                    │
│          │  □ Task 2 - Due: In 3 days                   │
│          │                                      [Chat 💬]│
└──────────┴──────────────────────────────────────────────┘
```

### Projects Page
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Velo              [User Avatar] ▼ [Logout]       │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ MENU     │  Projects               [+ New Project]       │
│          │                                               │
│ Dashboard│  ┌─────────────┐  ┌─────────────┐           │
│ Projects │  │ Project 1   │  │ Project 2   │           │
│ Tasks    │  │ Description │  │ Description │           │
│ Profile  │  │ ──────────  │  │ ──────────  │           │
│          │  │ 5 tasks     │  │ 3 tasks     │           │
│          │  │ [Edit] [Del]│  │ [Edit] [Del]│           │
│          │  └─────────────┘  └─────────────┘           │
│          │                                               │
│          │  ┌─────────────┐  ┌─────────────┐           │
│          │  │ Project 3   │  │ Project 4   │           │
│          │  │ Description │  │ Description │           │
│          │  │ ──────────  │  │ ──────────  │           │
│          │  │ 8 tasks     │  │ 2 tasks     │           │
│          │  │ [Edit] [Del]│  │ [Edit] [Del]│           │
│          │  └─────────────┘  └─────────────┘           │
│          │                                      [Chat 💬]│
└──────────┴──────────────────────────────────────────────┘
```

### Tasks Page
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Velo              [User Avatar] ▼ [Logout]       │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ MENU     │  All Tasks                 [+ New Task]       │
│          │                                               │
│ Dashboard│  Filters:                                     │
│ Projects │  [Search...] [Project ▼] [Status ▼] [Priority▼]
│ Tasks    │                                [Clear Filters]│
│ Profile  │                                               │
│          │  ┌───────────────────────────────────────┐   │
│          │  │ ☐ Task Title 1               [H] [🟢] │   │
│          │  │   Description here...                 │   │
│          │  │   Project: Web App  Due: 2025-12-30   │   │
│          │  │   [Edit] [Delete]                     │   │
│          │  └───────────────────────────────────────┘   │
│          │                                               │
│          │  ┌───────────────────────────────────────┐   │
│          │  │ ☑ Task Title 2               [M] [🔵] │   │
│          │  │   Description here...                 │   │
│          │  │   Project: API      Due: 2025-12-28   │   │
│          │  │   [Edit] [Delete]                     │   │
│          │  └───────────────────────────────────────┘   │
│          │                                      [Chat 💬]│
└──────────┴──────────────────────────────────────────────┘
```

### Profile Page
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Velo              [User Avatar] ▼ [Logout]       │
├──────────┬──────────────────────────────────────────────┤
│          │                                               │
│ MENU     │  Profile Settings                             │
│          │  Manage your account information              │
│ Dashboard│                                               │
│ Projects │  ┌───────────────────────────────────────┐   │
│ Tasks    │  │   [U]  Username                       │   │
│ Profile  │  │        user@email.com                 │   │
│          │  └───────────────────────────────────────┘   │
│          │                                               │
│          │  Account Information                          │
│          │  ┌──────────────────────────┐                │
│          │  │ Email: user@email.com    │                │
│          │  └──────────────────────────┘                │
│          │  ┌──────────────────────────┐                │
│          │  │ Username: johndoe        │                │
│          │  └──────────────────────────┘                │
│          │                                               │
│          │  [Edit Profile]                               │
│          │                                               │
│          │  (When editing:)                              │
│          │  Change Password (optional)                   │
│          │  - Current Password                           │
│          │  - New Password                               │
│          │  - Confirm Password                           │
│          │                                               │
│          │  [Cancel] [Save Changes]             [Chat 💬]│
└──────────┴──────────────────────────────────────────────┘
```

## deployed links

- **Frontend**: https://velo-frontend-app.vercel.app
- **Backend**: https://velo-backend-a2rv.onrender.com


