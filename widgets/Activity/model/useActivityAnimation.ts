'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Header (icon + title + diagonal arrow) fades up first, then the row of
// project cards staggers in beneath it as the section enters the viewport.
export const useActivityAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      })
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' },
        )
      }
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(':scope > *')
        if (cards.length) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.08,
              clearProps: 'transform',
            },
            '-=0.3',
          )
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return { sectionRef, headerRef, cardsRef }
}
