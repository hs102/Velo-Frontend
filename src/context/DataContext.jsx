/**
 * Data Context Provider
 * Manages projects and tasks state across the application
 */
import React, { createContext, useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import { AuthContext } from './AuthContext';

// Create the context
export const DataContext = createContext(null);

/**
 * DataProvider component that wraps the app and provides data state
 */
export const DataProvider = ({ children }) => {
  // Projects state
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState(null);

  // Get auth context
  const { isAuthenticated } = useContext(AuthContext);

  // ==================== PROJECT OPERATIONS ====================

  /**
   * Fetch all projects
   */
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setProjectsLoading(true);
    setProjectsError(null);
    
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      setProjectsError(err.message || 'Failed to fetch projects');
    } finally {
      setProjectsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch a single project by ID
   * @param {number|string} projectId
   */
  const fetchProject = useCallback(async (projectId) => {
    try {
      const data = await projectService.getProject(projectId);
      return data;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch project');
    }
  }, []);

  /**
   * Create a new project
   * @param {object} projectData
   */
  const createProject = useCallback(async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      throw new Error(err.message || 'Failed to create project');
    }
  }, []);

  /**
   * Update an existing project
   * @param {number|string} projectId
   * @param {object} projectData
   */
  const updateProject = useCallback(async (projectId, projectData) => {
    try {
      const updatedProject = await projectService.updateProject(projectId, projectData);
      setProjects(prev => 
        prev.map(p => p.id === projectId ? updatedProject : p)
      );
      return updatedProject;
    } catch (err) {
      throw new Error(err.message || 'Failed to update project');
    }
  }, []);

  /**
   * Delete a project
   * @param {number|string} projectId
   */
  const deleteProject = useCallback(async (projectId) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      // Also remove tasks associated with this project
      setTasks(prev => prev.filter(t => t.project_id !== projectId));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete project');
    }
  }, []);

  // ==================== TASK OPERATIONS ====================

  /**
   * Fetch all tasks with optional filters
   * @param {object} filters - { project_id, status, priority }
   */
  const fetchTasks = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;
    
    setTasksLoading(true);
    setTasksError(null);
    
    try {
      const data = await taskService.getTasks(filters);
      setTasks(data);
    } catch (err) {
      setTasksError(err.message || 'Failed to fetch tasks');
    } finally {
      setTasksLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch a single task by ID
   * @param {number|string} taskId
   */
  const fetchTask = useCallback(async (taskId) => {
    try {
      const data = await taskService.getTask(taskId);
      return data;
    } catch (err) {
      throw new Error(err.message || 'Failed to fetch task');
    }
  }, []);

  /**
   * Create a new task
   * @param {object} taskData
   */
  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      throw new Error(err.message || 'Failed to create task');
    }
  }, []);

  /**
   * Update an existing task
   * @param {number|string} taskId
   * @param {object} taskData
   */
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => 
        prev.map(t => t.id === taskId ? updatedTask : t)
      );
      return updatedTask;
    } catch (err) {
      throw new Error(err.message || 'Failed to update task');
    }
  }, []);

  /**
   * Delete a task
   * @param {number|string} taskId
   */
  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete task');
    }
  }, []);

  /**
   * Toggle task completion status (optimistic update)
   * @param {number|string} taskId
   */
  const toggleTaskStatus = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    // Optimistic update
    setTasks(prev => 
      prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    );

    try {
      await taskService.updateTask(taskId, { status: newStatus });
    } catch (err) {
      // Revert on error
      setTasks(prev => 
        prev.map(t => t.id === taskId ? { ...t, status: task.status } : t)
      );
      throw new Error(err.message || 'Failed to update task status');
    }
  }, [tasks]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setProjectsError(null);
    setTasksError(null);
  }, []);

  /**
   * Get tasks filtered by project
   * @param {number|string} projectId
   */
  const getTasksByProject = useCallback((projectId) => {
    return tasks.filter(t => t.project_id === projectId);
  }, [tasks]);

  /**
   * Get statistics for dashboard
   */
  const getStats = useCallback(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      return new Date(t.due_date) < new Date();
    }).length;

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      pendingTasks: totalTasks - completedTasks
    };
  }, [projects, tasks]);

  // Context value
  const value = {
    // Projects
    projects,
    projectsLoading,
    projectsError,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    
    // Tasks
    tasks,
    tasksLoading,
    tasksError,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByProject,
    
    // Utility
    clearErrors,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default DataContext;
