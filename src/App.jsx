// App.jsx
// Componente raíz de la aplicación. Define rutas, proveedores de contexto y el layout general de la app.
import React, { Suspense, lazy } from 'react'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
const Login = lazy(() => import('./pages/Login'))
const MapPage = lazy(() => import('./pages/MapPage'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Companies = lazy(() => import('./pages/Companies'))
// Inventory page now implemented
const Users = () => <div className="p-8">Usuarios (próximamente)</div>
const Settings = () => <div className="p-8">Configuración (próximamente)</div>
const Help = () => <div className="p-8">Ayuda & Soporte (próximamente)</div>
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/System/ErrorBoundary'
import TopProgressBar from './components/System/TopProgressBar'

const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-white">Cargando...</div>
  </div>
)

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Mientras verifica el token, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Verificando sesión...
        </div>
      </div>
    )
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si está autenticado, mostrar contenido
  return children
}

// Componente para ruta de login (solo accesible si NO está autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Mientras verifica, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  // Si ya está autenticado, redirigir a dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Si no está autenticado, mostrar login
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
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

export default App;