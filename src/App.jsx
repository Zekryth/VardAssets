// App.jsx
// Componente raíz de la aplicación. Define rutas, proveedores de contexto y el layout general de la app.
import React from 'react'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Login from './pages/Login'
import MapPage from './pages/MapPage'
import Inventory from './pages/Inventory'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
// Inventory page now implemented
const Users = () => <div className="p-8">Usuarios (próximamente)</div>
const Settings = () => <div className="p-8">Configuración (próximamente)</div>
const Help = () => <div className="p-8">Ayuda & Soporte (próximamente)</div>
import Layout from './components/Layout/Layout'
import ErrorBoundary from './components/System/ErrorBoundary'
import TopProgressBar from './components/System/TopProgressBar'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <ThemeProvider>
          <div className="App">
            <TopProgressBar />
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <MapPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/companies" element={
                  <ProtectedRoute>
                    <Layout>
                      <Companies />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/users" element={
                  <ProtectedRoute>
                    <Layout>
                      <Users />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/help" element={
                  <ProtectedRoute>
                    <Layout>
                      <Help />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;