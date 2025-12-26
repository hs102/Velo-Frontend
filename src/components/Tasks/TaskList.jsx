/**
 * TaskList Component
 * Display a list of task cards
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TaskCard from './TaskCard';
import { Loader } from '../Common';
import Button from '../Common/Button';
import { DataContext } from '../../context/DataContext';
import styles from '../../styles/Tasks.module.css';

const TaskList = ({ 
  tasks, 
  loading, 
  onEdit, 
  onDelete, 
  onStatusToggle,
  onCreateNew,
  showProject = true
}) => {
  const { projects } = useContext(DataContext);

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || null;
  };

  // Loading state
  if (loading) {
    return <Loader text="Loading tasks..." />;
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          <line x1="12" y1="12" x2="12" y2="16"></line>
          <line x1="10" y1="14" x2="14" y2="14"></line>
        </svg>
        <h3 className={styles.emptyTitle}>No tasks yet</h3>
        <p className={styles.emptyText}>
          Create your first task to get started
        </p>
        {onCreateNew && (
          <Button variant="primary" onClick={onCreateNew}>
            Create Task
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.tasksList}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusToggle={onStatusToggle}
          showProject={showProject}
          projectName={showProject ? getProjectName(task.project_id) : null}
        />
      ))}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      priority: PropTypes.string,
      status: PropTypes.string,
      due_date: PropTypes.string,
      project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusToggle: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func,
  showProject: PropTypes.bool
};

export default TaskList;
