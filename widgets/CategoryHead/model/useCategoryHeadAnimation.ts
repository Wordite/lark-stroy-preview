'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'

// Page-top header on the category page: title block fades up on mount,
// filters slide in slightly after.
export const useCategoryHeadAnimation = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' },
        )
      }
      if (filtersRef.current) {
        tl.fromTo(
          filtersRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          '-=0.3',
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return { rootRef, titleRef, filtersRef }
}
