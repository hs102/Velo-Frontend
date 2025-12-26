/**
 * Navbar Component
 * Top navigation bar with logo, user info, and logout
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/Layout.module.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  // Get user initials for avatar
  const getInitials = (username) => {
    if (!username) return '?';
    return username.charAt(0).toUpperCase();
  };

  return (
    <nav className={styles.navbar}>
      {/* Left side */}
      <div className={styles.navLeft}>
        {/* Mobile menu button */}
        <button 
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img 
            src="/velo-logo.png" 
            alt="Velo" 
            className={styles.logoImage}
          />
        </Link>
      </div>
      
      {/* Right side */}
      <div className={styles.navRight}>
        {/* User info */}
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {getInitials(user?.username)}
          </div>
          <span className={styles.userName}>{user?.username}</span>
        </div>
        
        {/* Logout button */}
        <button 
          className={styles.logoutButton}
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onMenuToggle: PropTypes.func.isRequired
};

export default Navbar;
