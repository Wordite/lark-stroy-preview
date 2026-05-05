'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Stagger fade + lift for the footer columns as it scrolls into view.
export const useFooterAnimation = () => {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    const ctx = gsap.context(() => {
      const columns = footerRef.current!.querySelectorAll(':scope > *')
      if (!columns.length) return
      gsap.fromTo(
        columns,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            once: true,
          },
        },
      )
    }, footerRef)
    return () => ctx.revert()
  }, [])

  return { footerRef }
}
