'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Footer lives in the root layout and persists across client-side
// navigations. ScrollTrigger occasionally mis-calculates positions during
// App Router transitions, leaving the footer stuck at opacity:0. Use a
// plain IntersectionObserver instead — fires on first viewport entry,
// never replays.
export const useFooterAnimation = () => {
  const footerRef = useRef<HTMLElement>(null)
  const playedRef = useRef(false)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const columns = el.querySelectorAll(':scope > *')
    if (!columns.length) return

    gsap.set(columns, { opacity: 0, y: 24 })

    const play = () => {
      if (playedRef.current) return
      playedRef.current = true
      gsap.to(columns, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      })
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            play()
            obs.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(el)

    // Fallback for short pages where the footer is already in view on mount
    // and IntersectionObserver may not fire.
    const t = window.setTimeout(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) play()
    }, 100)

    return () => {
      obs.disconnect()
      window.clearTimeout(t)
    }
  }, [])

  return { footerRef }
}
