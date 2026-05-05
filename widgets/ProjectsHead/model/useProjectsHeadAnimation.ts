'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Page-top block: title fades up first, filter selects fade in slightly after.
// No scroll trigger — this lives at the top of the projects page and animates
// immediately on mount.
export const useProjectsHeadAnimation = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
