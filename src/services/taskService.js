/**
 * Task service for CRUD operations on tasks
 */
import api from './api';

/**
 * Get all tasks for the current user
 * @param {object} filters - Optional filters { project_id, status, priority }
 * @returns {Promise<Array>} Array of tasks
 */
export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.project_id) {
    params.append('project_id', filters.project_id);
  }
  if (filters.status) {
    params.append('status', filters.status);
  }
  if (filters.priority) {
    params.append('priority', filters.priority);
  }
  
  const queryString = params.toString();
  const url = queryString ? `/tasks/?${queryString}` : '/tasks/';
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Get a single task by ID
 * @param {number|string} taskId - The task ID
 * @returns {Promise<object>} Task data
 */
export const getTask = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Create a new task
 * @param {object} taskData - { title, description?, priority?, status?, due_date?, project_id }
 * @returns {Promise<object>} Created task data
 */
export const createTask = async (taskData) => {
  const response = await api.post('/tasks/', taskData);
  return response.data;
};

/**
 * Update an existing task
 * @param {number|string} taskId - The task ID
 * @param {object} taskData - { title?, description?, priority?, status?, due_date?, project_id? }
 * @returns {Promise<object>} Updated task data
 */
export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

/**
 * Delete a task
 * @param {number|string} taskId - The task ID
 * @returns {Promise<void>}
 */
export const deleteTask = async (taskId) => {
  await api.delete(`/tasks/${taskId}`);
};

/**
 * Toggle task completion status
 * @param {number|string} taskId - The task ID
 * @param {string} currentStatus - Current status of the task
 * @returns {Promise<object>} Updated task data
 */
export const toggleTaskStatus = async (taskId, currentStatus) => {
  const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
  return updateTask(taskId, { status: newStatus });
};

const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};

export default taskService;
