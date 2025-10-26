/**
 * MapActionModeContext.jsx
 *
 * Contexto global para gestionar el modo de acción actual en el mapa (idle, adding, editing, etc.).
 * Permite a los componentes del mapa coordinar el estado de interacción y acciones del usuario.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

// action modes: idle | adding | editing | moving | deleting
const MapActionModeContext = createContext({
  mode: 'idle',
  setMode: () => {},
  resetMode: () => {},
  is: () => false,
  lastPointCreated: null,
  setLastPointCreated: () => {}
})

export const MapActionModeProvider = ({ children, initialMode = 'idle', disabled = false }) => {
  const [mode, setModeState] = useState(initialMode)
  const [lastPointCreated, setLastPointCreated] = useState(null)
  const prevMode = useRef(initialMode)

  const setMode = useCallback((next) => {
    if (disabled) return
    prevMode.current = mode
    setModeState(next)
  }, [mode, disabled])

  const resetMode = useCallback(() => setMode('idle'), [setMode])
  const is = useCallback((m) => mode === m, [mode])

  return (
    <MapActionModeContext.Provider value={{ mode, setMode, resetMode, is, lastPointCreated, setLastPointCreated }}>
      {children}
    </MapActionModeContext.Provider>
  )
}

export const useMapActionMode = () => useContext(MapActionModeContext)
