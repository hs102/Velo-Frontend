/**
 * Modal Component
 * A reusable modal dialog component
 */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'default',
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  // Handle escape key press
  const handleEscapeKey = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalClassNames = [
    styles.modal,
    size === 'large' && styles.modalLarge,
    size === 'small' && styles.modalSmall
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={modalClassNames}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {showCloseButton && (
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['default', 'small', 'large']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool
};

export default Modal;
