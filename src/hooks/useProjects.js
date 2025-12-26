/**
 * Custom hook for managing projects
 */
import { useContext, useEffect } from 'react';
import { DataContext } from '../context/DataContext';
import { useAuth } from './useAuth';

/**
 * Hook to access projects state and methods
 * @param {boolean} autoFetch - Whether to automatically fetch projects on mount
 * @returns {object} Projects data and methods
 */
export const useProjects = (autoFetch = false) => {
  const context = useContext(DataContext);
  const { isAuthenticated } = useAuth();
  
  if (!context) {
    throw new Error('useProjects must be used within a DataProvider');
  }

  const {
    projects,
    projectsLoading,
    projectsError,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  } = context;

  // Auto-fetch projects on mount if requested
  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      fetchProjects();
    }
  }, [autoFetch, isAuthenticated, fetchProjects]);

  return {
    projects,
    loading: projectsLoading,
    error: projectsError,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  };
};

export default useProjects;
