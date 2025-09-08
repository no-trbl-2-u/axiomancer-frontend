import React, { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactElement;
  requireCharacter?: boolean;
}

/**
 * ProtectedRoute Component
 * 
 * Checks for JWT authentication in sessionStorage and redirects to login if not authenticated.
 * Optionally can also check if user has a character and redirect to character creation.
 * 
 * @param children - The component to render if authenticated
 * @param requireCharacter - Whether the user must have a character to access this route
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireCharacter = false 
}) => {
  const { isLoggedIn, hasCharacter } = useAuth();
  const location = useLocation();

  // Check if user is logged in (has valid JWT)
  if (!isLoggedIn) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If this route requires a character and user doesn't have one, redirect to character creation
  if (requireCharacter && !hasCharacter) {
    return <Navigate to="/character-create" replace />;
  }

  // User is authenticated (and has character if required), render the protected component
  return children;
};

export default ProtectedRoute;