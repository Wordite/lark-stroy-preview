'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const NAV_COUNT_KEY = 'app:navCount'

export function NavigationTracker() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const current = Number(sessionStorage.getItem(NAV_COUNT_KEY)) || 0
      sessionStorage.setItem(NAV_COUNT_KEY, String(current + 1))
    } catch {}
  }, [pathname])

  return null
}
