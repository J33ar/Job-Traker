import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ requireRole }) {
  const user = useSelector(s => s.auth.user)
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (requireRole && user.role !== requireRole) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
