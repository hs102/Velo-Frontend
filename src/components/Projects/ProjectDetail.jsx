/**
 * ProjectDetail Component
 * Display a single project with its tasks
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import TaskList from '../Tasks/TaskList';
import TaskForm from '../Tasks/TaskForm';
import ProjectForm from './ProjectForm';
import { Modal, Button, Loader } from '../Common';
import styles from '../../styles/Projects.module.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { fetchProject, updateProject, deleteProject } = useProjects();
  const { 
    tasks, 
    loading: tasksLoading, 
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus 
  } = useTasks();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch project and tasks
  const loadProject = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projectData = await fetchProject(id);
      setProject(projectData);
      await fetchTasks({ project_id: id });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, fetchProject, fetchTasks]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  // Handle project update
  const handleProjectUpdate = async (formData) => {
    setFormLoading(true);
    try {
      const updated = await updateProject(id, formData);
      setProject(updated);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle project delete
  const handleProjectDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) {
      try {
        await deleteProject(id);
        navigate('/projects');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle task create/update
  const handleTaskSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask({ ...formData, project_id: parseInt(id) });
      }
      setShowTaskModal(false);
      setEditingTask(null);
      await fetchTasks({ project_id: id });
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle task edit
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Handle task delete
  const handleTaskDelete = async (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(task.id);
        await fetchTasks({ project_id: id });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle task status toggle
  const handleStatusToggle = async (taskId) => {
    try {
      await toggleTaskStatus(taskId);
    } catch (err) {
      setError(err.message);
    }
  };

  // Project tasks
  const projectTasks = tasks.filter(t => t.project_id === parseInt(id));

  if (loading) {
    return <Loader text="Loading project..." />;
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        <p>Error: {error}</p>
        <Button variant="secondary" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.emptyState}>
        <p>Project not found</p>
        <Button variant="secondary" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.projectDetail}>
      {/* Back button */}
      <Link to="/projects" className={styles.backButton}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Back to Projects
      </Link>

      {/* Project header */}
      <div 
        className={styles.projectDetailHeader}
        style={{ borderLeftColor: project.color || 'var(--accent-primary)' }}
      >
        <div className={styles.projectDetailInfo}>
          <h1 className={styles.projectDetailName}>{project.name}</h1>
          <p className={styles.projectDetailDescription}>
            {project.description || 'No description'}
          </p>
        </div>
        <div className={styles.projectDetailActions}>
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleProjectDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Tasks section */}
      <div className={styles.tasksSection}>
        <div className={styles.tasksSectionHeader}>
          <h2 className={styles.tasksSectionTitle}>Tasks</h2>
          <Button 
            variant="primary" 
            onClick={() => {
              setEditingTask(null);
              setShowTaskModal(true);
            }}
          >
            + Add Task
          </Button>
        </div>

        <TaskList
          tasks={projectTasks}
          loading={tasksLoading}
          onEdit={handleTaskEdit}
          onDelete={handleTaskDelete}
          onStatusToggle={handleStatusToggle}
          showProject={false}
        />
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
      >
        <ProjectForm
          project={project}
          onSubmit={handleProjectUpdate}
          onCancel={() => setShowEditModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          task={editingTask}
          projectId={parseInt(id)}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetail;
