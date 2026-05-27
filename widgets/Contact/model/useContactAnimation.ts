'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Left column copy + buttons fade up; right column arrow drops in and contact
// links stagger after, all triggered when the section enters the viewport.
export const useContactAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<SVGSVGElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

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

      const leftSequence = [labelRef.current, titleRef.current, subtitleRef.current].filter(Boolean)
      if (leftSequence.length) {
        tl.fromTo(
          leftSequence,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1 },
        )
      }

      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll(':scope > *')
        if (buttons.length) {
          tl.fromTo(
            buttons,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 },
            '-=0.3',
          )
        }
      }

      if (arrowRef.current) {
        tl.fromTo(
          arrowRef.current,
          { opacity: 0, scale: 0.6, rotate: -45 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.6)' },
          '-=0.6',
        )
      }

      if (linksRef.current) {
        const links = linksRef.current.querySelectorAll(':scope > *')
        if (links.length) {
          tl.fromTo(
            links,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 },
            '-=0.4',
          )
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return { sectionRef, labelRef, titleRef, subtitleRef, buttonsRef, arrowRef, linksRef }
}
