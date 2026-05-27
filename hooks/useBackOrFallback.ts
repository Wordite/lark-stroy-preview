'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useBackOrFallback(fallback: string) {
  const router = useRouter()

  return useCallback(() => {
    if (typeof window === 'undefined') {
      router.push(fallback)
      return
    }
    let sameOriginReferrer = false
    if (document.referrer) {
      try {
        sameOriginReferrer = new URL(document.referrer).origin === window.location.origin
      } catch {}
    }
    if (sameOriginReferrer) router.back()
    else router.push(fallback)
  }, [router, fallback])
}
