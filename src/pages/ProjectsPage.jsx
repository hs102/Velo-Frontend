/**
 * ProjectsPage Component
 * Page for viewing and managing projects
 */
import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectList, ProjectForm } from '../components/Projects';
import { Modal, Button } from '../components/Common';
import styles from '../styles/Projects.module.css';

const ProjectsPage = () => {
  const {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Handle create new project click
  const handleCreateNew = () => {
    setEditingProject(null);
    setFormError(null);
    setShowModal(true);
  };

  // Handle edit project click
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormError(null);
    setShowModal(true);
  };

  // Handle delete project click
  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? All tasks in this project will be deleted.`)) {
      try {
        await deleteProject(project.id);
      } catch (err) {
        console.error('Failed to delete project:', err);
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await createProject(formData);
      }
      setShowModal(false);
      setEditingProject(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProject(null);
    setFormError(null);
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.projectsHeader}>
        <h1 className={styles.projectsTitle}>Projects</h1>
        <Button variant="primary" onClick={handleCreateNew}>
          + New Project
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: 'var(--danger-light)', 
          color: 'var(--danger)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Project list */}
      <ProjectList
        projects={projects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateNew={handleCreateNew}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        {formError && (
          <div style={{ 
            padding: '12px 16px', 
            backgroundColor: 'var(--danger-light)', 
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px'
          }}>
            {formError}
          </div>
        )}
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
