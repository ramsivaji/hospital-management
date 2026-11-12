import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { Spinner } from '@/components/ui/Spinner'

export interface RequireAuthProps {
  role?: 'patient' | 'doctor' | 'admin' | 'receptionist'
  children?: React.ReactNode
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ role, children }) => {
  const { user, token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spinner size="lg" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    // If admin is allowed to view doctor/patient or vice-versa, handle appropriately
    return <Navigate to="/" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
