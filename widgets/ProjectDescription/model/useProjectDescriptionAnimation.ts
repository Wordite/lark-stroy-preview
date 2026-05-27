'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// "About" copy fades up first; gallery thumbs stagger; the right-side
// characteristics list slides in from the right.
export const useProjectDescriptionAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const galleryTitleRef = useRef<HTMLHeadingElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const specsRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          once: true,
        },
      })
      if (aboutRef.current) {
        tl.fromTo(
          aboutRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'transform' },
        )
      }
      if (galleryTitleRef.current) {
        tl.fromTo(
          galleryTitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'transform' },
          '-=0.3',
        )
      }
      if (galleryRef.current) {
        const items = galleryRef.current.querySelectorAll(':scope > *')
        if (items.length) {
          tl.fromTo(
            items,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.07,
              clearProps: 'transform',
            },
            '-=0.3',
          )
        }
      }
      if (moreButtonRef.current) {
        tl.fromTo(
          moreButtonRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' },
          '-=0.2',
        )
      }
      if (specsRef.current) {
        tl.fromTo(
          specsRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform' },
          '-=1.2',
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return {
    sectionRef,
    aboutRef,
    galleryTitleRef,
    galleryRef,
    moreButtonRef,
    specsRef,
  }
}
