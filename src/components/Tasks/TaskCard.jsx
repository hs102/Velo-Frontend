/**
 * TaskCard Component
 * Display a single task card
 */
import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, isOverdue } from '../../utils/dateFormatter';
import styles from '../../styles/Tasks.module.css';

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onStatusToggle,
  showProject = true,
  projectName
}) => {
  const isTaskOverdue = task.status !== 'completed' && isOverdue(task.due_date);
  const isCompleted = task.status === 'completed';

  // Get priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return styles.priorityHigh;
      case 'medium': return styles.priorityMedium;
      case 'low': return styles.priorityLow;
      default: return '';
    }
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'todo': return styles.statusTodo;
      case 'in_progress': return styles.statusInProgress;
      case 'completed': return styles.statusCompleted;
      default: return '';
    }
  };

  // Format status label
  const formatStatus = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className={`${styles.taskCard} ${isCompleted ? styles.taskCardCompleted : ''}`}>
      {/* Checkbox */}
      <div 
        className={`${styles.taskCheckbox} ${isCompleted ? styles.taskCheckboxChecked : ''}`}
        onClick={() => onStatusToggle(task.id)}
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onStatusToggle(task.id)}
      >
        {isCompleted && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>

      {/* Content */}
      <div className={styles.taskContent}>
        <div className={`${styles.taskTitle} ${isCompleted ? styles.taskTitleCompleted : ''}`}>
          {task.title}
        </div>
        
        {task.description && (
          <p className={styles.taskDescription}>{task.description}</p>
        )}
        
        <div className={styles.taskMeta}>
          {/* Priority badge */}
          <span className={`${styles.taskBadge} ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
          
          {/* Status badge */}
          <span className={`${styles.taskBadge} ${getStatusClass(task.status)}`}>
            {formatStatus(task.status)}
          </span>
          
          {/* Project badge */}
          {showProject && projectName && (
            <span className={`${styles.taskBadge} ${styles.projectBadge}`}>
              {projectName}
            </span>
          )}
          
          {/* Due date */}
          {task.due_date && (
            <span className={`${styles.dueDate} ${isTaskOverdue ? styles.dueDateOverdue : ''}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {isTaskOverdue ? 'Overdue: ' : ''}{formatDate(task.due_date)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.taskActions}>
        <button 
          className={styles.actionButton}
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        
        <button 
          className={`${styles.actionButton} ${styles.actionButtonDanger}`}
          onClick={() => onDelete(task)}
          aria-label="Delete task"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low', 'medium', 'high']),
    status: PropTypes.oneOf(['todo', 'in_progress', 'completed']),
    due_date: PropTypes.string,
    project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusToggle: PropTypes.func.isRequired,
  showProject: PropTypes.bool,
  projectName: PropTypes.string
};

export default TaskCard;
