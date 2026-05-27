'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Mounted-on-load: back-arrow slides in from the left, title fades up,
// description follows. No scroll trigger — this block sits at the top of
// the page and should animate immediately.
export const useActivityHeadAnimation = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      // Кнопка «назад» отображается сразу — без opacity-0 / slide-in. Только
        // последующие блоки анимируются с задержкой.
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.2',
        )
      }
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3',
        )
      }
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return { rootRef, backRef, titleRef, descRef }
}
