'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Page-top hero block: back button slides in from the left, title fades up,
// tags stagger in, hero image fades in last.
export const useProjectHeadAnimation = () => {
  const rootRef = useRef<HTMLElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      if (backRef.current) {
        tl.fromTo(
          backRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
        )
      }
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' },
          '-=0.3',
        )
      }
      if (tagsRef.current) {
        const items = tagsRef.current.querySelectorAll(':scope > *')
        if (items.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              ease: 'power2.out',
              stagger: 0.06,
              clearProps: 'transform',
            },
            '-=0.3',
          )
        }
      }
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform' },
          '-=0.3',
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return { rootRef, backRef, titleRef, tagsRef, imageRef }
}
