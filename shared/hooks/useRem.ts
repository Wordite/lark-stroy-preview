'use client'

import { useEffect, useState, useCallback } from 'react'

const readRoot = (): number => {
  if (typeof window === 'undefined') return 16
  const fs = window.getComputedStyle(document.documentElement).fontSize
  const n = parseFloat(fs)
  return Number.isFinite(n) && n > 0 ? n : 16
}

/**
 * Returns a reactive rem→px converter.
 *
 * The site uses `:root { font-size: 1.1111vw }`, so 1rem changes with the
 * viewport. Components that need pixel values for measurement-based math
 * (slider track widths, transforms) cannot use Tailwind's static rem classes
 * directly — they need the live value. This hook reads the computed root
 * font-size and updates on viewport resize.
 *
 * Usage:
 *   const rem = useRem()
 *   const CARD_WIDTH = rem(27.875)   // 27.875rem in current px
 *
 * Returns 16-based fallback during SSR / before mount.
 */
export function useRem() {
  const [base, setBase] = useState<number>(16)

  useEffect(() => {
    const update = () => setBase(readRoot())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return useCallback((rem: number) => rem * base, [base])
}
