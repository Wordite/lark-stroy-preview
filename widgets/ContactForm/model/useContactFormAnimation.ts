'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Title fades up first, then form fields stagger in. The right column
// (separator decoration + social contacts + work time) fades from the right
// in a small stagger.
export const useContactFormAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const sideRef = useRef<HTMLDivElement>(null)
  const socialContactsRef = useRef<HTMLDivElement>(null)
  const sideSeparatorRef = useRef<HTMLDivElement>(null)
  const workTimeRef = useRef<HTMLDivElement>(null)

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

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        )
      }

      if (formRef.current) {
        const fields = formRef.current.querySelectorAll(':scope > *')
        if (fields.length) {
          tl.fromTo(
            fields,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              stagger: 0.08,
              // Drop the inline transform after the animation finishes so each
              // field no longer creates its own stacking context — otherwise
              // the dropdown panel gets pinned under sibling fields.
              clearProps: 'transform',
            },
            '-=0.3',
          )
        }
      }

      if (sideRef.current) {
        tl.fromTo(
          sideRef.current,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform' },
          '-=0.5',
        )
      }

      const sideBlocks = [
        socialContactsRef.current,
        sideSeparatorRef.current,
        workTimeRef.current,
      ].filter(Boolean) as HTMLElement[]
      if (sideBlocks.length) {
        tl.fromTo(
          sideBlocks,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
            clearProps: 'transform',
          },
          '-=0.5',
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return {
    sectionRef,
    titleRef,
    formRef,
    sideRef,
    socialContactsRef,
    sideSeparatorRef,
    workTimeRef,
  }
}
