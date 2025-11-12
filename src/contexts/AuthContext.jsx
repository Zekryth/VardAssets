/**
 * AuthContext.jsx
 *
 * Contexto de autenticación global para la aplicación.
 * Proporciona el usuario actual, funciones de login/logout y utilidades para verificar el rol (admin/usuario).
 * Permite proteger rutas y componentes según permisos.
 */
import React, { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const forceLogout = params.has('logout')
    const skipAuto = params.has('forcelogin') || params.has('nologin')

    if (forceLogout) {
      localStorage.removeItem('token')
      // Keep language preference
    }

    if (!skipAuto && !forceLogout) {
      const token = localStorage.getItem('token')
      if (token) {
        setUser({ 
          nombre: 'Administrator VardAssets', 
          email: 'admin@VardAssets.com', 
          rol: 'admin' 
        })
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (username === 'admin' && password === '123456') {
      const userData = {
        nombre: 'Administrator VardAssets',
        email: 'admin@VardAssets.com',
        rol: 'admin'
      }
      setUser(userData)
      localStorage.setItem('token', 'admin-token-2024')
      return { success: true, message: 'Access granted' }
    } else if (username === 'user' && password === '123456') {
      const userData = {
        nombre: 'User VardAssets',
        email: 'user@VardAssets.com',
        rol: 'usuario'
      }
      setUser(userData)
      localStorage.setItem('token', 'user-token-2024')
      return { success: true, message: 'Access granted' }
    } else {
      return { success: false, message: 'Invalid credentials' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    // Keep language preference, only clear auth token
    // Force a clean reload to login page
    if (typeof window !== 'undefined') {
      // Use replace to avoid history issues
      window.location.replace('/login?logout=1')
    }
  }

  const isAdmin = () => {
    return user?.rol === 'admin'
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}