/**
 * ProjectList Component
 * Display a grid of project cards
 */
import React from 'react';
import PropTypes from 'prop-types';
import ProjectCard from './ProjectCard';
import { Loader } from '../Common';
import Button from '../Common/Button';
import styles from '../../styles/Projects.module.css';

const ProjectList = ({ 
  projects, 
  loading, 
  onEdit, 
  onDelete, 
  onCreateNew 
}) => {
  // Loading state
  if (loading) {
    return <Loader text="Loading projects..." />;
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          <line x1="12" y1="11" x2="12" y2="17"></line>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
        <h3 className={styles.emptyTitle}>No projects yet</h3>
        <p className={styles.emptyText}>
          Create your first project to start organizing your tasks
        </p>
        <Button variant="primary" onClick={onCreateNew}>
          Create Project
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.projectsGrid}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      color: PropTypes.string,
      task_count: PropTypes.number
    })
  ).isRequired,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired
};

export default ProjectList;
