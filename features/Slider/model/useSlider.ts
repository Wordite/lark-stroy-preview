'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface UseSliderArgs {
  totalSlides: number
  cardWidth: number
  visibleCount: number
}

export const useSlider = ({ totalSlides, cardWidth, visibleCount }: UseSliderArgs) => {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  const maxIndex = Math.max(0, totalSlides - visibleCount)
  const canPrev = index > 0
  const canNext = index < maxIndex

  const goPrev = () => setIndex((i) => Math.max(0, i - 1))
  const goNext = () => setIndex((i) => Math.min(maxIndex, i + 1))

  const indexRef = useRef(0)
  const maxIndexRef = useRef(maxIndex)
  useEffect(() => {
    indexRef.current = index
  }, [index])
  useEffect(() => {
    maxIndexRef.current = maxIndex
  }, [maxIndex])

  useEffect(() => {
    if (!trackRef.current) return
    gsap.to(trackRef.current, {
      x: -index * cardWidth,
      duration: 0.7,
      ease: 'power3.out',
    })
  }, [index, cardWidth])

  // Pointer drag (mouse + touch)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const DRAG_THRESHOLD_PX = 5
    const SNAP_RATIO = 0.2

    let startX = 0
    let delta = 0
    let isDown = false
    let isDragging = false
    let activePointerId: number | null = null
    const baseX = () => -indexRef.current * cardWidth

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      isDown = true
      isDragging = false
      activePointerId = e.pointerId
      startX = e.clientX
      delta = 0
      gsap.killTweensOf(track)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown || e.pointerId !== activePointerId) return
      delta = e.clientX - startX
      if (!isDragging && Math.abs(delta) > DRAG_THRESHOLD_PX) {
        isDragging = true
        try {
          track.setPointerCapture(e.pointerId)
        } catch {}
      }
      if (isDragging) {
        gsap.set(track, { x: baseX() + delta })
      }
    }

    const finish = (e: PointerEvent) => {
      if (!isDown || e.pointerId !== activePointerId) return
      isDown = false
      const wasDragging = isDragging
      isDragging = false
      activePointerId = null
      if (track.hasPointerCapture(e.pointerId)) {
        track.releasePointerCapture(e.pointerId)
      }
      if (!wasDragging) return

      const threshold = cardWidth * SNAP_RATIO
      if (Math.abs(delta) > threshold) {
        const dir = delta < 0 ? 1 : -1
        const steps = Math.max(1, Math.round(Math.abs(delta) / cardWidth))
        const next = Math.max(0, Math.min(maxIndexRef.current, indexRef.current + dir * steps))
        if (next === indexRef.current) {
          gsap.to(track, { x: baseX(), duration: 0.4, ease: 'power3.out' })
        } else {
          setIndex(next)
        }
      } else {
        gsap.to(track, { x: baseX(), duration: 0.4, ease: 'power3.out' })
      }
      delta = 0
    }

    // Suppress synthetic clicks (e.g. card link navigation) that fire after a drag.
    const onClickCapture = (e: MouseEvent) => {
      if (Math.abs(delta) > DRAG_THRESHOLD_PX) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', finish)
    track.addEventListener('pointercancel', finish)
    track.addEventListener('click', onClickCapture, true)

    return () => {
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', finish)
      track.removeEventListener('pointercancel', finish)
      track.removeEventListener('click', onClickCapture, true)
    }
  }, [cardWidth])

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        )
      }
      if (trackRef.current) {
        // Only animate the initially visible slides — touching off-screen
        // slides would override the inline opacity:0 we use to hide them.
        const cards = trackRef.current.querySelectorAll(':scope > *')
        const initial = Array.from(cards).slice(0, visibleCount)
        if (initial.length) {
          tl.fromTo(
            initial,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
            '-=0.3',
          )
        }
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [visibleCount])

  return {
    sectionRef,
    trackRef,
    headerRef,
    index,
    canPrev,
    canNext,
    goPrev,
    goNext,
  }
}
