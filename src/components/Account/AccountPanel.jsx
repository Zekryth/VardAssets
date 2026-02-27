/**
 * AccountPanel.jsx
 *
 * User account panel component.
 * Displays authenticated user information, avatar, and logout options.
 */
import React, { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const Avatar = ({ name }) => {
  const initials = (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || 'U'
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-gray-700 dark:text-white text-sm font-semibold">
      {initials}
    </div>
  )
}

const AccountPanel = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-white/90 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 backdrop-blur transition-colors relative">
      {/* User info */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Avatar name={user?.nombre} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate text-gray-900 dark:text-gray-100" title={user?.nombre}>{user?.nombre}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user?.email}>{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:text-gray-300 text-xs capitalize">
              {user?.rol === 'admin' ? 'Role: Admin' : 'Role: User'}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={logout}
          aria-label="Log out"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default AccountPanel
