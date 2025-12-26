/**
 * TaskForm Component
 * Form for creating/editing tasks
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useProjects } from '../../hooks/useProjects';
import { validateTaskForm } from '../../utils/validators';
import { formatDateForInput } from '../../utils/dateFormatter';
import Button from '../Common/Button';
import styles from '../../styles/Tasks.module.css';

const TaskForm = ({ task, projectId, onSubmit, onCancel, loading }) => {
  const isEditing = !!task;
  const { projects } = useProjects(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    due_date: '',
    project_id: projectId || ''
  });
  const [errors, setErrors] = useState({});

  // Populate form with task data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        due_date: formatDateForInput(task.due_date) || '',
        project_id: task.project_id || projectId || ''
      });
    } else if (projectId) {
      setFormData(prev => ({
        ...prev,
        project_id: projectId
      }));
    }
  }, [task, projectId]);

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
    const validation = validateTaskForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      due_date: formData.due_date || null
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title field */}
      <div className={styles.formGroup}>
        <label htmlFor="title" className={styles.label}>
          Task Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          placeholder="Enter task title"
          autoFocus
        />
        {errors.title && (
          <span className={styles.errorText}>{errors.title}</span>
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
          placeholder="Enter task description (optional)"
          rows={3}
        />
      </div>

      {/* Project selector (hide if projectId is fixed) */}
      {!projectId && (
        <div className={styles.formGroup}>
          <label htmlFor="project_id" className={styles.label}>
            Project
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Priority and Status row */}
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="priority" className={styles.label}>
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status" className={styles.label}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Due date field */}
      <div className={styles.formGroup}>
        <label htmlFor="due_date" className={styles.label}>
          Due Date
        </label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className={styles.input}
        />
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
          {isEditing ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    due_date: PropTypes.string,
    project_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default TaskForm;
