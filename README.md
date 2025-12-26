# Task Manager Frontend

A modern, clean React application for managing tasks and projects. Built with React 18, React Router, and Axios.

## Features

- 🔐 **Authentication**: Secure login and registration with JWT tokens
- 📁 **Project Management**: Create, edit, and organize projects with custom colors
- ✅ **Task Management**: Full CRUD operations with priority and status tracking
- 🎯 **Filtering**: Filter tasks by project, status, and priority
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, minimal design with smooth animations

## Tech Stack

- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **CSS Modules** - Scoped styling

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login, Register components
│   ├── Layout/         # Navbar, Sidebar components
│   ├── Projects/       # Project management components
│   ├── Tasks/          # Task management components
│   └── Common/         # Reusable UI components
├── context/            # React Context providers
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── utils/              # Utility functions
├── styles/             # Global and component styles
├── App.jsx             # Main application component
└── index.js            # Entry point
```

## Prerequisites

- Node.js 16+ and npm
- Backend API running at `http://localhost:8001/api`

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-manager-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` if your API URL is different:
   ```
   REACT_APP_API_URL=http://localhost:8001/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run test suite |
| `npm run eject` | Eject from Create React App |

## API Endpoints

The application connects to the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/tasks/` - List all tasks (with filters)
- `POST /api/tasks/` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8001/api` |
| `REACT_APP_DEBUG` | Enable debug mode | `false` |

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT License