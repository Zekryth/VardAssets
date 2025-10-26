/**
 * ToastContext.jsx
 *
 * Contexto global para mostrar notificaciones tipo toast en la aplicación.
 * Permite a cualquier componente disparar mensajes de éxito, error o información.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

let tid = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const push = useCallback((toast) => {
    const id = ++tid
    const t = { id, type: toast.type || 'info', title: toast.title || '', message: toast.message || '', timeout: toast.timeout ?? 2800, action: toast.action || null }
    setToasts(prev => [...prev, t])
    if (t.timeout > 0) setTimeout(() => remove(id), t.timeout)
    return id
  }, [remove])

  const value = useMemo(() => ({ push, remove, toasts }), [push, remove, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 w-[min(92vw,360px)]">
      {toasts.map(t => (
        <div key={t.id} className={`rounded-lg border shadow-lg p-3 bg-white dark:bg-gray-900 ${
          t.type === 'success' ? 'border-green-300 dark:border-green-800' :
          t.type === 'error' ? 'border-red-300 dark:border-red-800' :
          'border-gray-200 dark:border-gray-700'}`}
        >
          <div className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">{t.title}</div>
          {t.message && <div className="text-xs text-gray-700 dark:text-gray-300">{t.message}</div>}
          <div className="mt-2 flex items-center justify-between">
            {t.action ? (
              <button className="text-xs text-primary-600 hover:underline" onClick={() => { t.action?.(); onClose(t.id) }}>Deshacer</button>
            ) : <span />}
            <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => onClose(t.id)}>Cerrar</button>
          </div>
        </div>
      ))}
    </div>
  )
}
