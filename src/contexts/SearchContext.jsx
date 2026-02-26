/**
 * SearchContext.jsx
 *
 * Contexto global para la búsqueda rápida en la aplicación.
 * Gestiona el estado de la búsqueda, sugerencias, historial y resultados para puntos, compañías y objetos.
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import api from '../services/api'

const SearchCtx = createContext(null)

const STORAGE_KEY = 'ms:search:q'
const COMMITTED_STORAGE_KEY = 'ms:search:committed:q'

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '')
  const [committedQuery, setCommittedQuery] = useState(() => sessionStorage.getItem(COMMITTED_STORAGE_KEY) || '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [suggestions, setSuggestions] = useState({ points: [], companies: [], objects: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef([])
  const abortRef = useRef(null)
  const [enterTick, setEnterTick] = useState(0)
  const [selection, setSelection] = useState(null) // { type, item }

  // Persist query
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, query)
  }, [query])

  useEffect(() => {
    sessionStorage.setItem(COMMITTED_STORAGE_KEY, committedQuery)
  }, [committedQuery])

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 250)
    return () => clearTimeout(id)
  }, [query])

  useEffect(() => {
    setSelection(null)
    setOpen(false)
  }, [query])

  // Fetch suggestions only when query is committed (Enter)
  useEffect(() => {
    const q = committedQuery
    if (!q || q.length < 2) {
      setSuggestions({ points: [], companies: [], objects: [] })
      setOpen(false)
      return
    }
    setLoading(true)
    setError(null)
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    api.get('/search', { params: { q }, signal: controller.signal })
      .then(res => {
        const payload = res.data || {}

        const normalizeFromResults = (results = []) => {
          const points = []
          const companies = []
          const objects = []

          results.forEach((item) => {
            if (!item) return
            const itemType = String(item.type || '').toLowerCase()
            if (itemType === 'point') points.push(item)
            else if (itemType === 'company') companies.push(item)
            else if (itemType === 'object') objects.push(item)
          })

          return { points, companies, objects }
        }

        const normalized = Array.isArray(payload.results)
          ? normalizeFromResults(payload.results)
          : {
              points: Array.isArray(payload.points) ? payload.points : [],
              companies: Array.isArray(payload.companies) ? payload.companies : [],
              objects: Array.isArray(payload.objects) ? payload.objects : []
            }

        const total = normalized.points.length + normalized.companies.length + normalized.objects.length
        setSuggestions(normalized)
        setOpen(total > 0)
        setActiveIndex(0)
      })
      .catch(err => {
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return
        setError(err)
      })
      .finally(() => setLoading(false))
  }, [committedQuery])

  const flatList = useMemo(() => {
    const list = []
    suggestions.points.forEach((p) => list.push({ type: 'point', item: p }))
    suggestions.companies.forEach((c) => list.push({ type: 'company', item: c }))
    suggestions.objects.forEach((o) => list.push({ type: 'object', item: o }))
    flatListRef.current = list
    return list
  }, [suggestions])

  const moveActive = (dir) => {
    if (!flatList.length) return
    setActiveIndex((idx) => {
      const next = (idx + dir + flatList.length) % flatList.length
      return next
    })
  }

  const commitQuery = (nextQuery) => {
    const resolved = typeof nextQuery === 'string' ? nextQuery : query
    setCommittedQuery(String(resolved || '').trim())
    setEnterTick((n) => n + 1)
  }

  const triggerEnter = (nextQuery) => commitQuery(nextQuery)

  const selectSuggestion = (row) => {
    setSelection(row)
    setOpen(false)
  }

  const selectActive = () => {
    if (!flatList.length) return
    const row = flatList[activeIndex]
    if (row) selectSuggestion(row)
  }

  const value = {
    query,
    setQuery,
    committedQuery,
    setCommittedQuery,
    commitQuery,
    debouncedQuery,
    suggestions,
    loading,
    error,
    open,
    setOpen,
    activeIndex,
    moveActive,
    flatList,
    enterTick,
    triggerEnter,
    selection,
    selectSuggestion,
    selectActive,
  }

  return (
    <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>
  )
}

export const useSearch = () => useContext(SearchCtx)
