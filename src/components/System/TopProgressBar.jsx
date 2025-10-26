import React, { useEffect, useState } from 'react'
import { subscribe, getActive } from './progressStore'

export default function TopProgressBar() {
  const [count, setCount] = useState(getActive())
  const [width, setWidth] = useState(0)

  useEffect(() => subscribe(setCount), [])

  useEffect(() => {
    if (count > 0) {
      // start incremental fake progress until completion
      let cancelled = false
      const step = () => {
        setWidth(w => {
          if (count === 0) return w
            const next = w + Math.random()*10
            return Math.min(next, 85)
        })
        if (!cancelled && count > 0) setTimeout(step, 400)
      }
      if (width === 0) setWidth(10)
      setTimeout(step, 200)
      return () => { cancelled = true }
    } else if (width > 0) {
      // finish animation
      const t = setTimeout(() => setWidth(0), 350)
      setWidth(100)
      return () => clearTimeout(t)
    }
  }, [count])

  return (
    <div className="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-0.5">
      {width > 0 && (
        <div className="h-full relative overflow-hidden transition-all duration-300" style={{ width: width+'%' }}>
          <div className="absolute inset-0 bg-primary-500 dark:bg-primary-400" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-40 animate-[pulse_1.4s_ease_infinite]" />
        </div>
      )}
    </div>
  )
}
