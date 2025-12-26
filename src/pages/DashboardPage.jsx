/**
 * DashboardPage Component
 * Main dashboard with overview stats and quick actions
 */
import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DataContext } from '../context/DataContext';
import { formatDate, isOverdue } from '../utils/dateFormatter';
import { Loader } from '../components/Common';
import ChatBot from '../components/ChatBot';
import styles from '../styles/Dashboard.module.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    projects,
    tasks,
    projectsLoading,
    tasksLoading,
    fetchProjects,
    fetchTasks,
    getStats
  } = useContext(DataContext);

  // Fetch data on mount
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [fetchProjects, fetchTasks]);

  const stats = getStats();
  const loading = projectsLoading || tasksLoading;

  // Get recent projects (last 5)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Get upcoming tasks (not completed, sorted by due date)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || '';
  };

  // Calculate completion percentage
  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  if (loading) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.greeting}>Welcome back, {user?.username}!</h1>
        <p className={styles.subtext}>Here's an overview of your tasks and projects</p>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Total Projects</span>
            <div className={`${styles.statIcon} ${styles.statIconProjects}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalProjects}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Total Tasks</span>
            <div className={`${styles.statIcon} ${styles.statIconTasks}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.totalTasks}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Completed</span>
            <div className={`${styles.statIcon} ${styles.statIconCompleted}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.completedTasks}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <span className={styles.statLabel}>Overdue</span>
            <div className={`${styles.statIcon} ${styles.statIconOverdue}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
          </div>
          <div className={styles.statValue}>{stats.overdueTasks}</div>
        </div>
      </div>

      {/* Progress Section */}
      {stats.totalTasks > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Task Progress</h2>
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Overall Completion</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Projects */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <Link to="/projects" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className={styles.emptySection}>
            <p>No projects yet. Create your first project to get started!</p>
          </div>
        ) : (
          <div className={styles.recentProjectsGrid}>
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className={styles.miniProjectCard}
                style={{ borderLeftColor: project.color || 'var(--accent-primary)' }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className={styles.miniProjectName}>{project.name}</div>
                <div className={styles.miniProjectMeta}>
                  {project.task_count || 0} tasks
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Tasks */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Tasks</h2>
          <Link to="/tasks" className={styles.viewAllLink}>
            View All →
          </Link>
        </div>
        
        {upcomingTasks.length === 0 ? (
          <div className={styles.emptySection}>
            <p>No upcoming tasks. All caught up!</p>
          </div>
        ) : (
          <div className={styles.upcomingTasksList}>
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className={styles.upcomingTaskItem}
                onClick={() => navigate('/tasks')}
              >
                <div 
                  className={`${styles.taskPriorityIndicator} ${styles[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]}`}
                ></div>
                <div className={styles.taskInfo}>
                  <div className={styles.taskName}>{task.title}</div>
                  <div className={`${styles.taskDue} ${isOverdue(task.due_date) ? styles.taskDueOverdue : ''}`}>
                    {isOverdue(task.due_date) ? 'Overdue: ' : 'Due: '}{formatDate(task.due_date)}
                  </div>
                </div>
                {task.project_id && (
                  <div className={styles.taskProjectName}>
                    {getProjectName(task.project_id)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chatbot */}
      <ChatBot context={{ projects, tasks }} />
    </div>
  );
};

export default DashboardPage;
