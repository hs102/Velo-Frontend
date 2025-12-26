/**
 * Date formatting utilities for the Task Manager application
 */

/**
 * Format a date string to a human-readable format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string to include time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a date to ISO format (YYYY-MM-DD) for input fields
 * @param {string|Date} date - The date to format
 * @returns {string} ISO formatted date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Get relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  const now = new Date();
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const diffInMs = dateObj.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInDays > 0) {
    return diffInDays === 1 ? 'Tomorrow' : `In ${diffInDays} days`;
  } else if (diffInDays < 0) {
    const absDays = Math.abs(diffInDays);
    return absDays === 1 ? 'Yesterday' : `${absDays} days ago`;
  } else if (diffInHours > 0) {
    return `In ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
  } else if (diffInHours < 0) {
    const absHours = Math.abs(diffInHours);
    return `${absHours} hour${absHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `In ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  } else if (diffInMinutes < 0) {
    const absMinutes = Math.abs(diffInMinutes);
    return `${absMinutes} minute${absMinutes > 1 ? 's' : ''} ago`;
  }
  
  return 'Just now';
};

/**
 * Check if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  // Set time to end of day for comparison
  now.setHours(23, 59, 59, 999);
  
  return dateObj < now;
};

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if a date is within the next n days
 * @param {string|Date} date - The date to check
 * @param {number} days - Number of days to check
 * @returns {boolean} True if the date is within n days
 */
export const isWithinDays = (date, days) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return dateObj >= now && dateObj <= futureDate;
};
