/**
 * TaskFilters Component
 * Filter controls for tasks
 */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useProjects } from '../../hooks/useProjects';
import styles from '../../styles/Tasks.module.css';

const TaskFilters = ({ onFilterChange, initialFilters = {} }) => {
  const { projects } = useProjects(true);
  
  const [filters, setFilters] = useState({
    project_id: '',
    status: '',
    priority: '',
    search: '',
    ...initialFilters
  });

  // Debounce search input
  const [searchInput, setSearchInput] = useState(filters.search);
  
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle select change
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      project_id: '',
      status: '',
      priority: '',
      search: ''
    });
    setSearchInput('');
  }, []);

  // Check if any filters are active
  const hasActiveFilters = filters.project_id || filters.status || filters.priority || filters.search;

  return (
    <div className={styles.filtersContainer}>
      {/* Search input */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Search</label>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {/* Project filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Project</label>
        <select
          name="project_id"
          value={filters.project_id}
          onChange={handleSelectChange}
          className={styles.filterSelect}
        >
          <option value="">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Status filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleSelectChange}
          className={styles.filterSelect}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Priority filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Priority</label>
        <select
          name="priority"
          value={filters.priority}
          onChange={handleSelectChange}
          className={styles.filterSelect}
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleClearFilters}
          className={styles.clearFiltersButton}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

TaskFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  initialFilters: PropTypes.shape({
    project_id: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    search: PropTypes.string
  })
};

export default TaskFilters;
