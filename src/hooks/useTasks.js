/**
 * Custom hook for managing tasks
 */
import { useContext, useEffect, useState, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import { useAuth } from './useAuth';

/**
 * Hook to access tasks state and methods
 * @param {object} options - { autoFetch, initialFilters }
 * @returns {object} Tasks data and methods
 */
export const useTasks = (options = {}) => {
  const { autoFetch = false, initialFilters = {} } = options;
  
  const context = useContext(DataContext);
  const { isAuthenticated } = useAuth();
  
  if (!context) {
    throw new Error('useTasks must be used within a DataProvider');
  }

  const {
    tasks,
    tasksLoading,
    tasksError,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByProject
  } = context;

  // Local filter state
  const [filters, setFilters] = useState(initialFilters);

  // Auto-fetch tasks on mount if requested
  useEffect(() => {
    if (autoFetch && isAuthenticated) {
      fetchTasks(filters);
    }
  }, [autoFetch, isAuthenticated, fetchTasks, filters]);

  /**
   * Update filters and refetch
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Refresh tasks with current filters
   */
  const refresh = useCallback(() => {
    fetchTasks(filters);
  }, [fetchTasks, filters]);

  /**
   * Filter tasks by search term (client-side)
   */
  const searchTasks = useCallback((searchTerm) => {
    if (!searchTerm) return tasks;
    
    const term = searchTerm.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
  }, [tasks]);

  /**
   * Sort tasks by field
   */
  const sortTasks = useCallback((field, order = 'asc') => {
    return [...tasks].sort((a, b) => {
      let valueA = a[field];
      let valueB = b[field];
      
      // Handle dates
      if (field === 'due_date' || field === 'created_at' || field === 'updated_at') {
        valueA = valueA ? new Date(valueA).getTime() : 0;
        valueB = valueB ? new Date(valueB).getTime() : 0;
      }
      
      // Handle priority
      if (field === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        valueA = priorityOrder[valueA] || 0;
        valueB = priorityOrder[valueB] || 0;
      }
      
      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  }, [tasks]);

  /**
   * Get tasks grouped by status
   */
  const getTasksByStatus = useCallback(() => {
    return {
      todo: tasks.filter(t => t.status === 'todo'),
      in_progress: tasks.filter(t => t.status === 'in_progress'),
      completed: tasks.filter(t => t.status === 'completed')
    };
  }, [tasks]);

  /**
   * Get overdue tasks
   */
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      return new Date(task.due_date) < now;
    });
  }, [tasks]);

  /**
   * Get upcoming tasks (due within n days)
   */
  const getUpcomingTasks = useCallback((days = 7) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return tasks.filter(task => {
      if (!task.due_date || task.status === 'completed') return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= now && dueDate <= futureDate;
    }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  }, [tasks]);

  return {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    filters,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByProject,
    applyFilters,
    clearFilters,
    refresh,
    searchTasks,
    sortTasks,
    getTasksByStatus,
    getOverdueTasks,
    getUpcomingTasks
  };
};

export default useTasks;
