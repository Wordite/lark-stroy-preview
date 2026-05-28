'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

const NAV_COUNT_KEY = 'app:navCount'

export function useBackOrFallback(fallback: string) {
  const router = useRouter()

  return useCallback(() => {
    if (typeof window === 'undefined') {
      router.push(fallback)
      return
    }
    let navCount = 0
    try {
      navCount = Number(sessionStorage.getItem(NAV_COUNT_KEY)) || 0
    } catch {}
    if (navCount > 1) router.back()
    else router.push(fallback)
  }, [router, fallback])
}
