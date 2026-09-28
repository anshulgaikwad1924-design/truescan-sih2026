import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, appUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ts-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ts-peach"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && appUser && !allowedRoles.includes(appUser.role)) {
    // Role not authorized, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
