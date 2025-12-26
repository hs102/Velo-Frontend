/**
 * TasksPage Component
 * Page for viewing and managing all tasks
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { TaskList, TaskForm, TaskFilters } from '../components/Tasks';
import { Modal, Button } from '../components/Common';
import ChatBot from '../components/ChatBot';
import styles from '../styles/Tasks.module.css';

const TasksPage = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    searchTasks
  } = useTasks();

  // Also load projects for the form dropdown
  const { projects, fetchProjects } = useProjects();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [filters, setFilters] = useState({});
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  // Apply filters when tasks or filters change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply project filter
    if (filters.project_id) {
      result = result.filter(t => t.project_id === parseInt(filters.project_id));
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }
    
    // Apply priority filter
    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }
    
    // Apply search filter
    if (filters.search) {
      result = searchTasks(filters.search);
      // Re-apply other filters on search results
      if (filters.project_id) {
        result = result.filter(t => t.project_id === parseInt(filters.project_id));
      }
      if (filters.status) {
        result = result.filter(t => t.status === filters.status);
      }
      if (filters.priority) {
        result = result.filter(t => t.priority === filters.priority);
      }
    }
    
    setFilteredTasks(result);
  }, [tasks, filters, searchTasks]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle create new task click
  const handleCreateNew = () => {
    setEditingTask(null);
    setFormError(null);
    setShowModal(true);
  };

  // Handle edit task click
  const handleEdit = (task) => {
    setEditingTask(task);
    setFormError(null);
    setShowModal(true);
  };

  // Handle delete task click
  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        console.error('Failed to delete task:', err);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (taskId) => {
    try {
      await toggleTaskStatus(taskId);
    } catch (err) {
      console.error('Failed to toggle task status:', err);
    }
  };

  // Handle form submit
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    setFormError(null);
    
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormError(null);
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.tasksHeader}>
        <h1 className={styles.tasksTitle}>All Tasks</h1>
        <Button variant="primary" onClick={handleCreateNew}>
          + New Task
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

      {/* Filters */}
      <TaskFilters onFilterChange={handleFilterChange} />

      {/* Task list */}
      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusToggle={handleStatusToggle}
        onCreateNew={handleCreateNew}
        showProject={true}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
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
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
        />
      </Modal>

      {/* Chatbot */}
      <ChatBot context={{ projects, tasks }} />
    </div>
  );
};

export default TasksPage;
