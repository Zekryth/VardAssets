import React from 'react'
import MapBoard from './MapBoard.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useMapActionMode } from '../../contexts/MapActionModeContext.jsx'

export default function MapComponent({ onViewInfo, onContainer, points = [], onPointSelect, isMoving = false, onPointMove, onPointDelete }) {
  const auth = (typeof useAuth === 'function' ? useAuth() : {}) || {}
  const admin = typeof auth.isAdmin === 'function' ? !!auth.isAdmin() : !!auth.isAdmin
  const { mode } = (typeof useMapActionMode === 'function' ? useMapActionMode() : { mode: 'idle' })
  const isTiling = mode === 'tiling'
  const isDeleting = mode === 'deleting'
  return (
    <div className="relative w-full h-full">
      <MapBoard
        className="absolute inset-0"
        isAdmin={admin}
        isTiling={isTiling}
        onViewInfo={onViewInfo}
        onContainer={onContainer}
        points={points}
        onPointSelect={onPointSelect}
        isMoving={isMoving}
        onPointMove={onPointMove}
        isDeleting={isDeleting}
        onPointDelete={onPointDelete}
      />
    </div>
  )
}