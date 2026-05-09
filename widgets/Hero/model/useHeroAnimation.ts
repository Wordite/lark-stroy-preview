import { useRef, useEffect, useState } from 'react'
import { useHeroSliderStore, type IHeroSlide } from '@/core/store/heroSliderStore'
import gsap from 'gsap'

export const useHeroAnimation = (slides: IHeroSlide[]) => {
  const activeSlide = useHeroSliderStore((s) => s.activeSlide)
  const [displaySlide, setDisplaySlide] = useState(activeSlide)
  const slide = slides[displaySlide - 1] ?? slides[0]

  const tagsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const els = [tagsRef.current, titleRef.current, descRef.current, buttonsRef.current].filter(Boolean)

    if (isFirstRender.current) {
      isFirstRender.current = false
      gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' })
      return
    }

    if (tlRef.current) {
      tlRef.current.kill()
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.to(els, {
      opacity: 0,
      y: -20,
      duration: 0.2,
      stagger: 0.02,
      ease: 'power2.in',
    })
    tl.call(() => setDisplaySlide(activeSlide))
    tl.set(els, { y: 30 })
    tl.to(els, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.out',
    })

    return () => {
      tl.kill()
    }
  }, [activeSlide])

  return { slide, tagsRef, titleRef, descRef, buttonsRef }
}
