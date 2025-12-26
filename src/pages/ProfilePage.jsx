/**
 * ProfilePage Component
 * Page for viewing and updating user profile
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Loader } from '../components/Common';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';
import styles from '../styles/Profile.module.css';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Validate username
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;

    // If changing password, validate
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }

      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) errors.newPassword = passwordError;

      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Prepare update payload
      const updateData = {
        email: formData.email,
        username: formData.username
      };

      // Only include password fields if changing password
      if (formData.newPassword) {
        updateData.current_password = formData.currentPassword;
        updateData.new_password = formData.newPassword;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8001/api'}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to update profile');
      }

      // Refresh user data
      await refreshUser();
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    setFormErrors({});
    
    // Reset form to current user data
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Profile Settings</h1>
        <p className={styles.subtitle}>Manage your account information</p>
      </div>

      <div className={styles.profileCard}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userInfo}>
            <h2>{user.username}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Account Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className={formErrors.email ? styles.inputError : ''}
              />
              {formErrors.email && (
                <span className={styles.errorText}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className={formErrors.username ? styles.inputError : ''}
              />
              {formErrors.username && (
                <span className={styles.errorText}>{formErrors.username}</span>
              )}
            </div>
          </div>

          {/* Password Section - Only show when editing */}
          {isEditing && (
            <div className={styles.section}>
              <h3>Change Password</h3>
              <p className={styles.sectionNote}>Leave blank to keep current password</p>

              <div className={styles.formGroup}>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={formErrors.currentPassword ? styles.inputError : ''}
                  placeholder="Enter current password"
                />
                {formErrors.currentPassword && (
                  <span className={styles.errorText}>{formErrors.currentPassword}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={formErrors.newPassword ? styles.inputError : ''}
                  placeholder="Enter new password"
                />
                {formErrors.newPassword && (
                  <span className={styles.errorText}>{formErrors.newPassword}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className={formErrors.confirmPassword ? styles.inputError : ''}
                  placeholder="Confirm new password"
                />
                {formErrors.confirmPassword && (
                  <span className={styles.errorText}>{formErrors.confirmPassword}</span>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className={styles.actions}>
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="primary"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={handleCancel}
                  variant="secondary"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
