// ===================================================
// src/App.jsx — Root component with routing
// Redirects users based on their role after login.
// ===================================================
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'

// Pages
import Home               from './pages/Home.jsx'
import Login              from './pages/Login.jsx'
import Register           from './pages/Register.jsx'
import CustomerDashboard  from './pages/CustomerDashboard.jsx'
import AdminDashboard     from './pages/AdminDashboard.jsx'
import SuperAdminDashboard from './pages/SuperAdminDashboard.jsx'

// ─── Protected Route helper ───────────────────────
// Redirects unauthenticated users to /login.
// Redirects authenticated users to their dashboard
// if they try to access a route meant for another role.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard
    if (user.role === 'customer')   return <Navigate to="/dashboard/customer" replace />
    if (user.role === 'admin')      return <Navigate to="/dashboard/admin" replace />
    if (user.role === 'superadmin') return <Navigate to="/dashboard/superadmin" replace />
  }

  return children
}

// ─── Public Route helper ──────────────────────────
// Redirects logged-in users away from login/register
const PublicRoute = ({ children }) => {
  const { user } = useAuth()
  if (user) {
    if (user.role === 'customer')   return <Navigate to="/dashboard/customer" replace />
    if (user.role === 'admin')      return <Navigate to="/dashboard/admin" replace />
    if (user.role === 'superadmin') return <Navigate to="/dashboard/superadmin" replace />
  }
  return children
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Customer dashboard */}
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Super Admin dashboard */}
        <Route
          path="/dashboard/superadmin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
