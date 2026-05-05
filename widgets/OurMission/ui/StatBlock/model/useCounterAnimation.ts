import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const useCounterAnimation = (value: number, suffix: string) => {
  const valueRef = useRef<HTMLParagraphElement>(null)
  const counter = useRef({ val: 0 })

  useEffect(() => {
    const el = valueRef.current
    if (!el) return

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter.current, {
          val: value,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(counter.current.val)}${suffix}`
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [value, suffix])

  return { valueRef }
}
