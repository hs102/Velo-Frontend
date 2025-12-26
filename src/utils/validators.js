/**
 * Validation utilities for the Task Manager application
 */

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate username
 * @param {string} username - The username to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (username.length > 50) {
    return { isValid: false, message: 'Username must be less than 50 characters' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate required field
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field for error message
 * @returns {object} Validation result with isValid and message
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate project name
 * @param {string} name - The project name to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateProjectName = (name) => {
  const requiredCheck = validateRequired(name, 'Project name');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }
  
  if (name.length > 100) {
    return { isValid: false, message: 'Project name must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate task title
 * @param {string} title - The task title to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateTaskTitle = (title) => {
  const requiredCheck = validateRequired(title, 'Task title');
  if (!requiredCheck.isValid) {
    return requiredCheck;
  }
  
  if (title.length > 200) {
    return { isValid: false, message: 'Task title must be less than 200 characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate hex color
 * @param {string} color - The color to validate
 * @returns {boolean} True if color is a valid hex color
 */
export const isValidHexColor = (color) => {
  if (!color) return true; // Optional field
  
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
};

/**
 * Validate due date (must be today or future)
 * @param {string|Date} date - The date to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateDueDate = (date) => {
  if (!date) {
    return { isValid: true, message: '' }; // Optional field
  }
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }
  
  // Allow today and future dates
  dateObj.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    return { isValid: false, message: 'Due date cannot be in the past' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validate login form
 * @param {object} data - Form data with username and password
 * @returns {object} Validation result with isValid and errors object
 */
export const validateLoginForm = (data) => {
  const errors = {};
  
  if (!data.username || !data.username.trim()) {
    errors.username = 'Username or email is required';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate registration form
 * @param {object} data - Form data with email, username, and password
 * @returns {object} Validation result with isValid and errors object
 */
export const validateRegisterForm = (data) => {
  const errors = {};
  
  if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate project form
 * @param {object} data - Form data with name, description, color
 * @returns {object} Validation result with isValid and errors object
 */
export const validateProjectForm = (data) => {
  const errors = {};
  
  const nameValidation = validateProjectName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  if (data.color && !isValidHexColor(data.color)) {
    errors.color = 'Please enter a valid hex color (e.g., #FF5733)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate task form
 * @param {object} data - Form data with title, description, priority, status, due_date, project_id
 * @returns {object} Validation result with isValid and errors object
 */
export const validateTaskForm = (data) => {
  const errors = {};
  
  const titleValidation = validateTaskTitle(data.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.message;
  }
  
  const validPriorities = ['low', 'medium', 'high'];
  if (data.priority && !validPriorities.includes(data.priority)) {
    errors.priority = 'Please select a valid priority';
  }
  
  const validStatuses = ['todo', 'in_progress', 'completed'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.status = 'Please select a valid status';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
