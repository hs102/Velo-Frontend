/**
 * ProjectForm Component
 * Form for creating/editing projects
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { validateProjectForm } from '../../utils/validators';
import Button from '../Common/Button';
import styles from '../../styles/Projects.module.css';

const ProjectForm = ({ project, onSubmit, onCancel, loading }) => {
  const isEditing = !!project;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#4f46e5'
  });
  const [errors, setErrors] = useState({});

  // Populate form with project data when editing
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        color: project.color || '#4f46e5'
      });
    }
  }, [project]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateProjectForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name field */}
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Project Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Enter project name"
          autoFocus
        />
        {errors.name && (
          <span className={styles.errorText}>{errors.name}</span>
        )}
      </div>

      {/* Description field */}
      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Enter project description (optional)"
          rows={3}
        />
      </div>

      {/* Color picker */}
      <div className={styles.formGroup}>
        <label htmlFor="color" className={styles.label}>
          Project Color
        </label>
        <div className={styles.colorPicker}>
          <input
            type="color"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={styles.colorInput}
          />
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className={`${styles.input} ${styles.colorHexInput}`}
            placeholder="#000000"
          />
          <div 
            className={styles.colorPreview}
            style={{ backgroundColor: formData.color }}
          ></div>
        </div>
        {errors.color && (
          <span className={styles.errorText}>{errors.color}</span>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {isEditing ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

ProjectForm.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProjectForm;
