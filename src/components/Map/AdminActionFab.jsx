import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Plus, MousePointerClick, Move, Trash2, X, LayoutGrid } from 'lucide-react'
import { useMapActionMode } from '../../contexts/MapActionModeContext'
import Button from '../UI/Button'

// Minimal class join helper (avoid external clsx dependency)
const cx = (...classes) => classes.filter(Boolean).join(' ')

const ACTIONS = [
  { key: 'adding', label: 'Add point', icon: Plus },
  { key: 'moving', label: 'Move point', icon: Move },
  { key: 'deleting', label: 'Delete point', icon: Trash2 },
  { key: 'tiling', label: 'Edit tiles', icon: LayoutGrid }
]

/**
 * AdminActionFab
 * Renders a floating action button for admin-only map edit modes.
 * Feature flag: hide by passing isAdmin={false}. To disable globally without auth logic,
 * you can early-return null here or wrap provider usage conditionally.
 * Backend integration notes:
 *  - 'adding': upon map click (to be implemented in MapInteractionLayer), send POST to /points
 *  - 'editing': select point -> open PointPanel (future multi-window) -> PATCH on save
 *  - 'moving': enable draggable marker, send PATCH with new coordinates on drop
 *  - 'deleting': confirm then DELETE /points/:id
 */
export default function AdminActionFab({ isAdmin }) {
  const { mode, setMode, resetMode, is } = useMapActionMode()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  const toggleOpen = useCallback(() => setOpen(o => !o), [])
  const closeMenu = useCallback(() => setOpen(false), [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!menuRef.current) return
      if (menuRef.current.contains(e.target) || triggerRef.current?.contains(e.target)) return
      closeMenu()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, closeMenu])

  // Escape handling
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (open) {
          closeMenu()
          resetMode()
          triggerRef.current?.focus()
        } else if (mode !== 'idle') {
          resetMode()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, mode, resetMode, closeMenu])

  const handleSelect = (k) => {
    if (mode === k) {
      resetMode()
    } else {
      setMode(k)
    }
    closeMenu()
  }

  if (!isAdmin) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="flex flex-col items-end gap-3">
        {open && (
          <div
            ref={menuRef}
            role="menu"
            aria-label="Acciones del mapa"
            className="p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col gap-1 w-48 animate-fade-in"
          >
            {ACTIONS.map(a => {
              const Icon = a.icon
              const active = is(a.key)
              return (
                <button
                  key={a.key}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => handleSelect(a.key)}
                  className={cx(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 ring-offset-2 ring-primary-500',
                    active
                      ? 'bg-primary-600 text-white shadow'
                      : 'bg-white/70 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 hover:bg-primary-50 dark:hover:bg-gray-600'
                  )}
                >
                  <Icon size={16} />
                  <span className="flex-1 text-left">{a.label}</span>
                  {active && <X size={14} className="opacity-80" />}
                </button>
              )
            })}
          </div>
        )}
        <Button
          ref={triggerRef}
          variant="solid"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Acciones del mapa"
          onClick={toggleOpen}
          className={cx(
            'h-14 w-14 rounded-full p-0 flex items-center justify-center shadow-lg transition-transform',
            mode !== 'idle' ? 'bg-primary-600 hover:bg-primary-500' : 'bg-primary-500 hover:bg-primary-400'
          )}
        >
          {mode === 'idle' && <MousePointerClick size={26} />}
          {mode === 'adding' && <Plus size={26} />}
          {mode === 'moving' && <Move size={26} />}
          {mode === 'deleting' && <Trash2 size={26} />}
          {mode === 'tiling' && <LayoutGrid size={26} />}
        </Button>
      </div>
    </div>
  )
}
