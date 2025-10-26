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
    }

    if (!skipAuto) {
      const token = localStorage.getItem('token')
      if (token) {
        setUser({ 
          nombre: 'Administrator MapShade', 
          email: 'admin@mapshade.com', 
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
        nombre: 'Administrator MapShade',
        email: 'admin@mapshade.com',
        rol: 'admin'
      }
      setUser(userData)
      localStorage.setItem('token', 'admin-token-2024')
      return { success: true, message: 'Access granted' }
    } else if (username === 'user' && password === '123456') {
      const userData = {
        nombre: 'User Demo',
        email: 'user@mapshade.com',
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
    // Redirect robustly to login, skipping autologin and ensuring token cleared
    if (typeof window !== 'undefined') {
      window.location.href = '/login?logout&forcelogin'
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