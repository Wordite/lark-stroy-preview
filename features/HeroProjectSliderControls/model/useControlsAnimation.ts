import { useRef, useEffect, useState } from 'react'
import { useHeroSliderStore } from '@/core/store/heroSliderStore'
import { slides } from '@/features/HeroProjectSlider'
import gsap from 'gsap'

export const useControlsAnimation = () => {
  const { activeSlide, totalSlides, next, prev } = useHeroSliderStore()
  const [displaySlide, setDisplaySlide] = useState(activeSlide)
  const slide = slides[displaySlide - 1]

  const yearRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLParagraphElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const els = [yearRef.current, counterRef.current].filter(Boolean)

    if (tlRef.current) {
      tlRef.current.kill()
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.to(els, {
      opacity: 0,
      y: -10,
      duration: 0.15,
      ease: 'power2.in',
    })
    tl.call(() => setDisplaySlide(activeSlide))
    tl.set(els, { y: 10 })
    tl.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: 'power3.out',
    })

    return () => {
      tl.kill()
    }
  }, [activeSlide])

  return { slide, displaySlide, totalSlides, activeSlide, next, prev, yearRef, counterRef }
}
