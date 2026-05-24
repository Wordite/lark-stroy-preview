'use client'

import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query and returns its current match state.
 * Returns `false` during SSR / before mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
