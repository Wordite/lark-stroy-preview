'use client'

import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { JOURNEY, ROUTE_POINTS } from './journey'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

const SEGMENTS = ROUTE_POINTS.slice(1).map((p, i) => {
  const prev = ROUTE_POINTS[i]
  return Math.hypot(p.x - prev.x, p.y - prev.y)
})
const TOTAL_LEN = SEGMENTS.reduce((a, b) => a + b, 0)
const CUM_LEN = ROUTE_POINTS.map((_, i) => SEGMENTS.slice(0, i).reduce((a, b) => a + b, 0))

// onActive — единственный источник правды о видимой карточке. Её показывают только
// клики по городам (после интро-анимации), поэтому карточка всегда максимум одна.
export const useMapJourneyAnimation = (onActive: (index: number | null) => void) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context((self) => {
      const q = self!.selector!
      const mask = q('[data-route-mask]')[0] as SVGPathElement | undefined
      const routeVisible = q('[data-route-visible]')[0] as SVGPathElement | undefined
      const pins = q('[data-city-pin]')
      const mainPins = q('[data-main-city]')

      const len = mask ? mask.getTotalLength() : TOTAL_LEN
      const offsetAt = (frac: number) => len * (1 - frac)
      if (mask) gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len })

      // Пунктир и главные города скрыты до старта (opacity 0 уже в JSX —
      // дублируем через gsap.set для надёжности)
      if (routeVisible) gsap.set(routeVisible, { opacity: 0 })
      gsap.set(mainPins, { opacity: 0 })

      const setCard = (index: number | null) => onActiveRef.current(index)

      // Интро ~2 сек: проигрывается один раз, когда секция появляется в зоне
      // видимости. Без pin и scrub — скролл не блокируется. После анимации
      // пользователь сам кликает по городам, чтобы увидеть карточки.
      const drawDur = 1
      const pinFade = 0.2
      const mainFade = 0.35

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      })

      // Карточка скрыта на старте интро
      tl.call(() => setCard(null))

      // Первый город + проявление пунктира
      tl.fromTo(pins[0], { opacity: 0 }, { opacity: 1, duration: pinFade, ease: 'power2.out' })
      if (routeVisible) tl.to(routeVisible, { opacity: 1, duration: 0.01 }, '<')

      // Рисуем маршрут по сегментам, города проявляются по мере подхода линии
      for (let i = 1; i < ROUTE_POINTS.length; i++) {
        const dur = (SEGMENTS[i - 1] / TOTAL_LEN) * drawDur
        tl.to(mask ?? {}, { strokeDashoffset: offsetAt(CUM_LEN[i] / TOTAL_LEN), duration: dur })
        tl.fromTo(pins[i], { opacity: 0 }, { opacity: 1, duration: pinFade, ease: 'power2.out' }, '>-0.12')
      }

      // Главные города-метки проявляются в конце
      if (mainPins.length) tl.to(mainPins, { opacity: 1, duration: mainFade, ease: 'power2.out' }, '+=0.1')
    }, sectionRef)

    let lastW = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === lastW) return
      lastW = window.innerWidth
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return { sectionRef, pinRef }
}
