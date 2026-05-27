'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Stagger fade + lift for the four activity cards as the grid scrolls into view.
export const useActivitiesAnimation = () => {
  const gridRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll(':scope > a')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      )
    }, gridRef)

    return () => ctx.revert()
  }, [])

  return { gridRef }
}
