import React from 'react'
import { MapPin } from 'lucide-react'
import { usePointPanels } from '../../contexts/PointPanelsContext'

export default function PointPanelsDock() {
  const { panels, toggleMinimize, bringToFront } = usePointPanels()
  const minimized = panels.filter(p => p.minimized)
  if (minimized.length === 0) return null
  return (
    <div className="absolute bottom-3 right-3 left-3 md:left-auto md:w-auto z-[60]">
      <div className="max-w-full md:max-w-[60vw] ml-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur px-2 py-2 shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {minimized.map(p => (
            <button
              key={p.id}
              onClick={() => { toggleMinimize(p.id); bringToFront(p.id) }}
              className="shrink-0 inline-flex items-center gap-2 px-3 h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-800 dark:text-gray-100"
              title={p.title}
            >
              <span className="text-base">{p.point?.icon || '📍'}</span>
              <span className="max-w-[18ch] truncate">{p.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
