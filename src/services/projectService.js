/**
 * Project service for CRUD operations on projects
 */
import api from './api';

/**
 * Get all projects for the current user
 * @returns {Promise<Array>} Array of projects
 */
export const getProjects = async () => {
  const response = await api.get('/projects/');
  return response.data;
};

/**
 * Get a single project by ID (includes tasks)
 * @param {number|string} projectId - The project ID
 * @returns {Promise<object>} Project data with tasks
 */
export const getProject = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

/**
 * Create a new project
 * @param {object} projectData - { name, description?, color? }
 * @returns {Promise<object>} Created project data
 */
export const createProject = async (projectData) => {
  const response = await api.post('/projects/', projectData);
  return response.data;
};

/**
 * Update an existing project
 * @param {number|string} projectId - The project ID
 * @param {object} projectData - { name?, description?, color? }
 * @returns {Promise<object>} Updated project data
 */
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

/**
 * Delete a project (cascades to tasks)
 * @param {number|string} projectId - The project ID
 * @returns {Promise<void>}
 */
export const deleteProject = async (projectId) => {
  await api.delete(`/projects/${projectId}`);
};

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};

export default projectService;
