/**
 * Sidebar Component
 * Side navigation with links and stats
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { DataContext } from '../../context/DataContext';
import styles from '../../styles/Layout.module.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { getStats } = useContext(DataContext);
  const stats = getStats();

  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      label: 'Projects',
      path: '/projects',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    {
      label: 'All Tasks',
      path: '/tasks',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      )
    }
  ];

  const sidebarClassNames = [
    styles.sidebar,
    isOpen && styles.sidebarOpen
  ].filter(Boolean).join(' ');

  const overlayClassNames = [
    styles.sidebarOverlay,
    isOpen && styles.visible
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Overlay for mobile */}
      <div className={overlayClassNames} onClick={onClose}></div>
      
      {/* Sidebar */}
      <aside className={sidebarClassNames}>
        {/* Navigation */}
        <nav className={styles.navSection}>
          <span className={styles.navSectionTitle}>Menu</span>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path} className={styles.navItem}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                  onClick={onClose}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Stats section */}
        <div className={styles.statsSection}>
          <h3 className={styles.statsTitle}>Overview</h3>
          <div className={styles.statsList}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Projects</span>
              <span className={styles.statValue}>{stats.totalProjects}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Tasks</span>
              <span className={styles.statValue}>{stats.totalTasks}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue}>{stats.completedTasks}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Overdue</span>
              <span className={`${styles.statValue} ${stats.overdueTasks > 0 ? styles.statValueDanger : ''}`}>
                {stats.overdueTasks}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Sidebar;
