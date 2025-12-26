/**
 * ProjectCard Component
 * Display a single project card
 */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Projects.module.css';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Handle card click
  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };

  // Handle edit click
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(project);
  };

  // Handle delete click
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(project);
  };

  return (
    <div 
      className={styles.projectCard}
      onClick={handleClick}
      style={{ borderLeftColor: project.color || 'var(--accent-primary)' }}
    >
      {/* Header */}
      <div className={styles.projectCardHeader}>
        <h3 className={styles.projectName}>{project.name}</h3>
        <div className={styles.projectActions}>
          {/* Edit button */}
          <button 
            className={styles.actionButton}
            onClick={handleEdit}
            aria-label="Edit project"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          
          {/* Delete button */}
          <button 
            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
            onClick={handleDelete}
            aria-label="Delete project"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className={styles.projectDescription}>
        {project.description || 'No description'}
      </p>

      {/* Footer */}
      <div className={styles.projectFooter}>
        <div className={styles.taskCount}>
          <svg className={styles.taskCountIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <span>{project.task_count || 0} tasks</span>
        </div>
      </div>
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    color: PropTypes.string,
    task_count: PropTypes.number
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ProjectCard;
