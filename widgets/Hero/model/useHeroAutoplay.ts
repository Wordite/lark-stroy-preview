'use client'

import { useEffect } from 'react'
import { useHeroSliderStore } from '@/core/store/heroSliderStore'

const AUTOPLAY_DELAY = 3000

export function useHeroAutoplay() {
  const activeSlide = useHeroSliderStore((s) => s.activeSlide)
  const totalSlides = useHeroSliderStore((s) => s.totalSlides)
  const goTo = useHeroSliderStore((s) => s.goTo)

  useEffect(() => {
    if (totalSlides <= 1) return
    const id = setTimeout(() => {
      goTo(activeSlide >= totalSlides ? 1 : activeSlide + 1)
    }, AUTOPLAY_DELAY)
    return () => clearTimeout(id)
  }, [activeSlide, totalSlides, goTo])
}
