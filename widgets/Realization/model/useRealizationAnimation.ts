'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Title fades up first, then the road timeline reveals, then the project cards
// stagger in beneath it as the section enters the viewport.
export const useRealizationAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        )
      }
      if (roadRef.current) {
        tl.fromTo(
          roadRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.3',
        )
      }
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(':scope > *')
        if (cards.length) {
          tl.fromTo(
            cards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
            '-=0.3',
          )
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return { sectionRef, titleRef, roadRef, cardsRef }
}
