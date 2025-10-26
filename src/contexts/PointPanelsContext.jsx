/**
 * PointPanelsContext.jsx
 *
 * Contexto global para gestionar los paneles flotantes de puntos en el mapa.
 * Permite abrir, cerrar, mover y administrar múltiples paneles de información de puntos.
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { pointService } from '../services/api'

// Panel shape
// { id, pointId, title, x, y, w, h, minimized, z, point }
const MIN_W = 320
const MIN_H = 260

function clampPanel({ x, y, w, h }, bounds) {
  // Guard contra NaN o undefined
  x = Number.isFinite(x) ? x : 24
  y = Number.isFinite(y) ? y : 24
  w = Math.max(Number.isFinite(w) ? w : MIN_W, MIN_W)
  h = Math.max(Number.isFinite(h) ? h : MIN_H, MIN_H)
  if (!bounds) return { x, y, w, h }
  const { width: BW, height: BH } = bounds
  const maxOut = 0.6 // allow at most 60% outside
  const maxLeft = Math.max(-(w * maxOut), 0 - w)
  const maxTop = Math.max(-(h * maxOut), 0 - h)
  const maxRight = BW - Math.max(w * (1 - maxOut), 40)
  const maxBottom = BH - Math.max(h * (1 - maxOut), 40)
  const nx = Math.min(Math.max(x, maxLeft), maxRight)
  const ny = Math.min(Math.max(y, maxTop), maxBottom)
  return { x: nx, y: ny, w: Math.max(w, MIN_W), h: Math.max(h, MIN_H) }
}

const PointPanelsContext = createContext(null)

export function PointPanelsProvider({ children, getBounds }) {
  const [panels, setPanels] = useState([])
  const zRef = useRef(10)

  const bounds = useMemo(() => {
    try {
      return getBounds?.() || null
    } catch (_) {
      return null
    }
  }, [getBounds])

  const bringToFront = useCallback((id) => {
    setPanels((prev) => {
      const top = ++zRef.current
      return prev.map(p => p.id === id ? { ...p, z: top } : p)
    })
  }, [])

  const focusPanel = bringToFront

  const openPanel = useCallback((point) => {
    const pointId = point._id || point.id
    const title = point.nombre || 'Punto'
    if (!pointId) return
    setPanels(prev => {
      const existing = prev.find(p => p.pointId === pointId)
      if (existing) {
        // focus existing
        return prev.map(p => p.pointId === pointId ? { ...p, minimized: false, z: ++zRef.current } : p)
      }
      const top = ++zRef.current
      // Default size and position (cascade)
      const count = prev.length
      const w = 360
      const h = 420
      const baseX = 24 + (count * 24) % 96
      const baseY = 24 + (count * 24) % 96
      const clamped = clampPanel({ x: baseX, y: baseY, w, h }, bounds)
      const id = `${pointId}-${Date.now()}`
      return [...prev, { id, pointId, title, ...clamped, minimized: false, z: top, point }]
    })
  }, [bounds])

  const movePanel = useCallback((id, { x, y }) => {
    setPanels(prev => prev.map(p => {
      if (p.id !== id) return p
      const dims = clampPanel({ ...p, x, y }, bounds)
      return { ...p, ...dims }
    }))
  }, [bounds])

  const resizePanel = useCallback((id, { w, h }) => {
    setPanels(prev => prev.map(p => {
      if (p.id !== id) return p
      const dims = clampPanel({ ...p, w, h }, bounds)
      return { ...p, ...dims }
    }))
  }, [bounds])

  const toggleMinimize = useCallback((id) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, minimized: !p.minimized } : p))
  }, [])

  const closePanel = useCallback((id) => {
    setPanels(prev => prev.filter(p => p.id !== id))
  }, [])

  const refreshPanel = useCallback(async (id) => {
    // Refetch the point for this panel and update its data
    const panel = panels.find(p => p.id === id)
    if (!panel?.pointId) return
    
    try {
      const res = await pointService.getPoints()
      const allPoints = res.data?.points || res.data || []
      const updatedPoint = allPoints.find(p => (p._id || p.id) === panel.pointId)
      
      if (updatedPoint) {
        setPanels(prev => prev.map(p => 
          p.id === id ? { ...p, point: updatedPoint, title: updatedPoint.nombre || 'Punto' } : p
        ))
      }
    } catch (err) {
      console.error('Failed to refresh panel:', err)
    }
  }, [panels])

  const value = useMemo(() => ({
    panels,
    openPanel,
    focusPanel,
    movePanel,
    resizePanel,
    toggleMinimize,
    closePanel,
    bringToFront,
    refreshPanel,
    MIN_W,
    MIN_H
  }), [panels, openPanel, focusPanel, movePanel, resizePanel, toggleMinimize, closePanel, bringToFront, refreshPanel])

  return (
    <PointPanelsContext.Provider value={value}>{children}</PointPanelsContext.Provider>
  )
}

export function usePointPanels() {
  const ctx = useContext(PointPanelsContext)
  if (!ctx) throw new Error('usePointPanels must be used within PointPanelsProvider')
  return ctx
}
