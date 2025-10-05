import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../lib/auth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !auth.hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
