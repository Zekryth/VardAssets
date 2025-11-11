/**
 * Layout.jsx
 *
 * Componente de layout principal que define la estructura de la aplicación (sidebar, header, contenido).
 * Gestiona la navegación, el tema (claro/oscuro), y el acceso a rutas según el rol del usuario (admin/usuario).
 * Incluye el panel de cuenta y controles de UI responsivos.
 */
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  MapPin, Building2, Package, Users, Settings, BarChart3,
  HelpCircle, ChevronLeft, ChevronRight, Sun, Moon, Menu, X
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import AccountPanel from '../Account/AccountPanel.jsx'
import { Button } from '../UI/Button.jsx'
import { useTranslation } from 'react-i18next'
import '../../i18n'

const cx = (...p) => p.filter(Boolean).join(' ')

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const profileRef = useRef(null)
  const { t } = useTranslation()

  const routes = [
    { to: '/', label: t('nav.map'), icon: MapPin },
    ...(isAdmin() ? [{ to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 }] : []),
    ...(isAdmin() ? [
      { to: '/companies', label: t('nav.companies'), icon: Building2 },
      { to: '/inventory', label: t('nav.inventory'), icon: Package },
    ] : []),
    // Solo el admin ve el enlace de usuarios
    ...(isAdmin() ? [{ to: '/users', label: t('nav.users'), icon: Users }] : []),
    { to: '/settings', label: 'Configuración', icon: Settings },
    { to: '/help', label: 'Ayuda & Soporte', icon: HelpCircle }
  ]

  const titleMap = {
    '/': t('nav.map'),
    '/dashboard': t('nav.dashboard'),
    '/companies': t('nav.companies'),
    '/inventory': t('nav.inventory'),
    '/users': t('nav.users'),
    '/settings': 'Configuración',
    '/help': 'Ayuda & Soporte'
  }
  const currentTitle = titleMap[location.pathname] || t('nav.map')
  const CurrentIcon = (routes.find(r => r.to === location.pathname)?.icon) || MapPin

  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {}
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  const NavItem = ({ to, label, icon: Icon }) => {
    const active = location.pathname === to
    return (
      <button
        onClick={() => navigate(to)}
        className={cx(
          'relative w-full flex items-center rounded-md text-sm font-medium transition-colors h-10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60',
          collapsed ? 'justify-center px-2' : 'justify-start gap-3 px-3',
          active
            ? 'bg-primary-600/15 text-primary-600 dark:text-primary-300 dark:bg-primary-400/10'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        )}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? label : undefined}
      >
        <span className={cx('flex items-center justify-center w-9 h-9 rounded-md',
          active && 'scale-105 text-primary-600 dark:text-primary-300')}>
          <Icon size={18} />
        </span>
        {!collapsed && (
          <span className="truncate">{label}</span>
        )}
      </button>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
      <aside
        className={cx(
          'hidden lg:flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-950/80 transition-[width] duration-300 relative',
          collapsed ? 'w-16' : 'w-64'
        )}
        aria-label="Barra lateral de navegación"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className={cx('flex items-center overflow-hidden flex-1', collapsed ? 'justify-center' : 'gap-3')}>
            <div className="p-2 rounded-lg bg-primary-600/10 dark:bg-primary-500/15 text-primary-600 dark:text-primary-300">
              <CurrentIcon size={20} />
            </div>
            {!collapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                  {currentTitle}
                </h1>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">MapShade</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1">
              <Button
                variant="icon"
                size="icon"
                aria-label="Cambiar tema"
                title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </Button>
              <Button
                variant="icon"
                size="icon"
                aria-label="Colapsar menú"
                title="Colapsar menú"
                onClick={() => setCollapsed(true)}
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={16} />
              </Button>
            </div>
          )}
          {collapsed && (
            <Button
              variant="icon"
              size="icon"
              aria-label="Cambiar tema"
              title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1" role="navigation">
          {routes.map(r => (
            <NavItem key={r.to} {...r} />
          ))}
        </nav>

        {/* Panel cuenta */}
        {!collapsed && (
          <div className="mt-auto px-3 pb-4">
            <AccountPanel />
          </div>
        )}

        {/* Handle expand (VISIBLE SOLO COLAPSADO) */}
        {collapsed && (
          <Button
            variant="icon"
            size="icon"
            aria-label="Expandir menú"
            title="Expandir menú"
            onClick={() => setCollapsed(false)}
            className="absolute top-1/2 -right-3 translate-y-[-50%] z-20 rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ChevronRight size={16} />
          </Button>
        )}
      </aside>

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative h-full max-w-xs w-full flex flex-col bg-white dark:bg-gray-950 shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <MapPin size={22} className="text-primary-600 dark:text-primary-300" />
                <span className="text-base font-semibold text-gray-800 dark:text-gray-200">MapShade</span>
              </div>
              <Button variant="icon" size="icon" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">
                <X size={18} />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {routes.map(r => (
                <NavItem key={r.to} {...r} />
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <AccountPanel />
              </div>
            </nav>
          </div>
        </div>
      )}

      <Button
        onClick={() => setSidebarOpen(true)}
        variant="icon"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-40 rounded-lg bg-white/90 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 shadow-sm hover:bg-white dark:hover:bg-gray-800"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </Button>
    </div>
  )
}

export default Layout