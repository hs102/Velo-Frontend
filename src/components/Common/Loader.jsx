/**
 * Loader Component
 * A reusable loading indicator component
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/Loader.module.css';

const Loader = ({
  type = 'spinner',
  size = 'default',
  text = '',
  fullPage = false,
  overlay = false
}) => {
  const containerClassNames = [
    styles.loaderContainer,
    fullPage && styles.fullPage,
    overlay && styles.overlay,
    !fullPage && !overlay && styles.inline
  ].filter(Boolean).join(' ');

  const spinnerClassNames = [
    styles.spinner,
    size === 'small' && styles.spinnerSmall,
    size === 'large' && styles.spinnerLarge
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClassNames}>
      {type === 'spinner' && (
        <div className={spinnerClassNames} aria-label="Loading"></div>
      )}
      
      {type === 'dots' && (
        <div className={styles.dots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      )}
      
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

Loader.propTypes = {
  type: PropTypes.oneOf(['spinner', 'dots']),
  size: PropTypes.oneOf(['small', 'default', 'large']),
  text: PropTypes.string,
  fullPage: PropTypes.bool,
  overlay: PropTypes.bool
};

/**
 * Skeleton Loader Component
 * For content placeholder loading states
 */
export const Skeleton = ({ variant = 'text', width, height, className = '' }) => {
  const classNames = [
    styles.skeleton,
    variant === 'text' && styles.skeletonText,
    variant === 'title' && styles.skeletonTitle,
    variant === 'card' && styles.skeletonCard,
    className
  ].filter(Boolean).join(' ');

  const style = {
    ...(width && { width }),
    ...(height && { height })
  };

  return <div className={classNames} style={style}></div>;
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'title', 'card']),
  width: PropTypes.string,
  height: PropTypes.string,
  className: PropTypes.string
};

export default Loader;
