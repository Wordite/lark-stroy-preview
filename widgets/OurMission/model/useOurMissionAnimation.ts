import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useOurMissionAnimation = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const missionBlockRef = useRef<HTMLDivElement>(null)
  const missionTitleRef = useRef<HTMLHeadingElement>(null)
  const missionTextRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title + subtitle fade in from below
      gsap.fromTo(
        [titleRef.current, subtitleRef.current].filter(Boolean),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )

      // Mission block: slide up from behind the blur panel
      gsap.fromTo(
        [missionTitleRef.current, missionTextRef.current].filter(Boolean),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: missionBlockRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )

      // Stats block fade in
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return {
    sectionRef,
    titleRef,
    subtitleRef,
    missionBlockRef,
    missionTitleRef,
    missionTextRef,
    statsRef,
  }
}
