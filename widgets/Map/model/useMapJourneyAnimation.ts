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

const PILL_SHADOW = '0 0.25rem 1rem rgba(0,0,0,0.35)'
const PILL_SHADOW_ACTIVE = '0 0 0 0.25rem rgba(91,141,239,0.5), 0 0.5rem 1.5rem rgba(0,0,0,0.45)'

// На мобиле карта крупнее (ширина задаётся в CSS: max-md:w-[230%]) и при скролле
// панорамируется через translate к нужному городу — без transform: scale, чтобы
// картинка и пины оставались чёткими. panTo считает смещение как долю уже
// увеличенного бокса. MOBILE_VERT_BIAS дополнительно опускает карту вниз.
const MOBILE_VERT_BIAS = 10
const panTo = (i: number) => ({
  xPercent: (0.5 - JOURNEY[i].x / 100) * 100,
  yPercent: (0.5 - JOURNEY[i].y / 100) * 100 + MOBILE_VERT_BIAS,
  force3D: true,
})

// onActive — единственный источник правды о видимой карточке. Таймлайн зовёт его
// по ходу скролла (показать карточку i / скрыть = null); клики по городам зовут
// его же. Поэтому карточка всегда максимум одна.
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
      const box = q('[data-map-box]')[0]
      const pins = q('[data-city-pin]')
      const pills = q('[data-city-pill]')
      const mainPins = q('[data-main-city]')

      const len = mask ? mask.getTotalLength() : TOTAL_LEN
      const offsetAt = (frac: number) => len * (1 - frac)
      if (mask) gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len })

      // Пунктирный path скрыт до старта — opacity уже 0 в JSX,
      // дополнительно гарантируем через gsap.set
      if (routeVisible) gsap.set(routeVisible, { opacity: 0 })

      // Главные города-метки скрыты до конца анимации
      gsap.set(mainPins, { opacity: 0 })

      const setCard = (index: number | null) => onActiveRef.current(index)

      const build = (withPan: boolean) => {
        const drawDur  = 3
        const gap      = 0.5
        const panDur   = withPan ? 0.7 : 0
        const fadeIn   = 0.6
        const hold     = 0.8
        const fadeOut  = 0.6
        const mainFade = 0.6
        const endHold  = 3 // «пустое» пространство в конце: всё показано, можно кликать

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=760%',
            pin: pinRef.current,
            scrub: 0.4,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Карточка скрыта до первого города
        tl.call(() => setCard(null))

        // Фаза 1 — первый пин появляется (чёткий fade без scale), и одновременно
        // показываем пунктир
        tl.fromTo(pins[0], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        if (routeVisible) tl.to(routeVisible, { opacity: 1, duration: 0.01 }, '<')

        for (let i = 1; i < ROUTE_POINTS.length; i++) {
          const dur = (SEGMENTS[i - 1] / TOTAL_LEN) * drawDur
          tl.to(mask ?? {}, { strokeDashoffset: offsetAt(CUM_LEN[i] / TOTAL_LEN), duration: dur })
          if (withPan) tl.to(box, { ...panTo(i), duration: dur }, '<')
          tl.fromTo(pins[i], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, '>-0.05')
        }

        tl.to({}, { duration: gap })

        for (let i = 0; i < JOURNEY.length; i++) {
          if (withPan) tl.to(box, { ...panTo(i), duration: panDur })

          // Дискретное переключение карточки в точке (без «пустых» промежутков):
          // карточка i держится, пока скролл не дойдёт до следующего города.
          tl.call(() => setCard(i), [], withPan ? '<' : '>')
          tl.to(pills[i], { boxShadow: PILL_SHADOW_ACTIVE, duration: fadeIn }, '<')

          tl.to({}, { duration: hold })

          // Снимаем подсветку пилюли (карточку НЕ прячем — сменится на следующую)
          tl.to(pills[i], { boxShadow: PILL_SHADOW, duration: fadeOut })
        }

        // После завершения маршрута проявляем главные города-метки
        if (mainPins.length) tl.to(mainPins, { opacity: 1, duration: mainFade, ease: 'power2.out' })
        // Пустой хвост — карта стоит, всё показано, можно покликать по городам
        tl.to({}, { duration: endHold })
      }

      const mm = gsap.matchMedia()
      // Десктоп — карта целиком, без панорамирования.
      mm.add('(min-width: 768px)', () => build(false))
      // Мобила — карта крупнее (CSS max-md:w-[230%]) и едет к каждому городу.
      mm.add('(max-width: 767px)', () => {
        gsap.set(box, { ...panTo(0) })
        build(true)
      })
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
