/**
 * NotFoundPage Component
 * 404 page for unknown routes
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';

const NotFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '24px'
    }}>
      <h1 style={{ 
        fontSize: '72px', 
        fontWeight: 'bold',
        color: 'var(--text-muted)',
        margin: '0 0 16px 0'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '24px',
        marginBottom: '8px' 
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        color: 'var(--text-secondary)',
        marginBottom: '24px',
        maxWidth: '400px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
