/**
 * Main App Component
 * Sets up routing, context providers, and main layout
 */
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { useAuth } from './hooks/useAuth';
import { Navbar, Sidebar } from './components/Layout';
import { ProjectDetail } from './components/Projects';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  ProjectsPage,
  TasksPage,
  NotFoundPage
} from './pages';
import { Loader } from './components/Common';
import './styles/global.css';
import styles from './styles/Layout.module.css';

/**
 * Protected Route Wrapper
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loader fullPage text="Loading..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

/**
 * Main Layout Component
 * Includes navbar, sidebar, and main content area
 */
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <Navbar onMenuToggle={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className={styles.mainLayout}>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </>
  );
};

/**
 * App Routes Component
 * Defines all application routes
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<TasksPage />} />
        </Route>
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

/**
 * Main App Component
 */
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
