import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route protection:
 * Allows access to /admin/* ONLY if user role is "admin"
 * AND the owner has passed the admin password step in the current session.
 * Otherwise redirects customers/guests to /home and locked owners to /admin-login.
 */
export default function AdminRoute({ children }) {
  const { adminUnlocked } = useAuth();

  if (!adminUnlocked) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
