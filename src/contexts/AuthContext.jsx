/**
 * AuthContext.jsx
 *
 * Contexto de autenticación global para la aplicación.
 * Proporciona el usuario actual, funciones de login/logout y utilidades para verificar el rol (admin/usuario).
 * Permite proteger rutas y componentes según permisos.
 */
import React, { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    verifyToken()
  }, [])

  const verifyToken = async () => {
    console.log('🔍 Verifying stored token...')
    
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('⚠️ No stored token')
      setLoading(false)
      setIsAuthenticated(false)
      return
    }

    try {
      console.log('📡 Verifying token with backend...')
      const response = await api.get('/auth/verify')
      
      if (response.data.valid) {
        console.log('✅ Valid token:', response.data.user.email)
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        console.warn('⚠️ Invalid token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('❌ Error verifying token:', error.response?.status, error.message)
      
      // Only clear if 401 (unauthorized)
      if (error.response?.status === 401) {
        console.log('🗑️ Clearing invalid/expired token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login:', email)
      const response = await api.post('/auth', { email, password })
      
      const { token, user } = response.data
      
      console.log('✅ Login successful, saving token...')
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed',
        message: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const logout = () => {
    console.log('🚪 Logging out...')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    verifyToken
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}