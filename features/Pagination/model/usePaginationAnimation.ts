'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Page numbers stagger in from below; the action buttons (back arrow + next
// page) fade in from the right slightly after.
export const usePaginationAnimation = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLUListElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 90%',
          once: true,
        },
      })
      if (pagesRef.current) {
        const items = pagesRef.current.querySelectorAll(':scope > li')
        if (items.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.04,
              clearProps: 'transform',
            },
          )
        }
      }
      if (buttonsRef.current) {
        tl.fromTo(
          buttonsRef.current,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          '-=0.2',
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return { rootRef, pagesRef, buttonsRef }
}
