import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export const useMarqueeAnimation = () => {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const firstSet = track.children[0] as HTMLElement
    if (!firstSet) return

    const width = firstSet.offsetWidth

    const tween = gsap.to(track, {
      x: -width,
      duration: 30,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tween.kill()
    }
  }, [])

  return { trackRef }
}
