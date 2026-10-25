import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
        Authenticating...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If hospital staff tries to access admin dashboard or vice versa, redirect to their home
    if (user.role === 'SWASTH360_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'HOSPITAL_ADMIN') return <Navigate to="/hospital/dashboard" replace />;
    if (user.role === 'HOSPITAL_STAFF') return <Navigate to="/hospital/staff" replace />;
    if (user.role === 'INDIVIDUAL_USER') return <Navigate to="/individual/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
