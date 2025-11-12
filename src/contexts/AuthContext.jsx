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
    console.log('🔍 Verificando token almacenado...')
    
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('⚠️ No hay token almacenado')
      setLoading(false)
      setIsAuthenticated(false)
      return
    }

    try {
      console.log('📡 Verificando token con backend...')
      const response = await api.get('/auth/verify')
      
      if (response.data.valid) {
        console.log('✅ Token válido:', response.data.user.email)
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        console.warn('⚠️ Token inválido')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('❌ Error verificando token:', error.response?.status, error.message)
      
      // Solo limpiar si es 401 (no autorizado)
      if (error.response?.status === 401) {
        console.log('🗑️ Limpiando token inválido/expirado')
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
      console.log('🔐 Intentando login:', email)
      const response = await api.post('/auth', { email, password })
      
      const { token, user } = response.data
      
      console.log('✅ Login exitoso, guardando token...')
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user)
      setIsAuthenticated(true)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al iniciar sesión',
        message: error.response?.data?.error || 'Error al iniciar sesión'
      }
    }
  }

  const logout = () => {
    console.log('🚪 Cerrando sesión...')
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