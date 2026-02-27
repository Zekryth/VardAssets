// App.jsx
// Root component of the application. Defines routes, context providers and the general layout.
import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
const Login = lazy(() => import('./pages/Login'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Companies = lazy(() => import('./pages/Companies'))
// Inventory page now implemented
const Users = () => <div className="p-8">Users (coming soon)</div>
const Settings = () => <div className="p-8">Settings (coming soon)</div>
const Help = () => <div className="p-8">Help & Support (coming soon)</div>
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/System/ErrorBoundary'
import TopProgressBar from './components/System/TopProgressBar'

const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-white">Loading...</div>
  </div>
)

// Component for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // While verifying token, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Verifying session...
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If authenticated, show content
  return children
}

// Component for login route (only accessible if NOT authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // While verifying, show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // If not authenticated, show login
  return children
}

const ProtectedLayoutRoute = () => (
  <ProtectedRoute>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
)


function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="App">
          <TopProgressBar />
          <ErrorBoundary>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />

                <Route element={<ProtectedLayoutRoute />}>
                  <Route index element={<MapPage />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="companies" element={<Companies />} />
                  <Route path="inventory" element={<Inventory />} />
                  <Route path="users" element={<Users />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="help" element={<Help />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;