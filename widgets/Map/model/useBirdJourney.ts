'use client'

import { useCallback, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import {
  JOURNEY,
  SECONDARY_CITIES,
  LANDMARKS,
  BIRD_LIFT,
  MAP_IMG_H,
  curveBetween,
  flightPathTo,
  toMapPoint,
  type IJourneyCity,
  type IPoint,
} from './journey'

gsap.registerPlugin(MotionPathPlugin)

const REST_MS = 3000
const CLICK_PAUSE_MS = 10000
const LAST = JOURNEY.length - 1

export const LIFT_PCT = (BIRD_LIFT / MAP_IMG_H) * 100

const liftedPoint = (city: { x: number; y: number }) => {
  const p = toMapPoint(city)
  return { x: p.x, y: p.y - BIRD_LIFT }
}

// Точки, которые «открываются» пёрышками, слетающими с птицы в полёте.
interface IFeatherTarget {
  id: string
  sel: string
  pulseSel: string
  point: IPoint
}

const FEATHER_TARGETS: IFeatherTarget[] = [
  ...LANDMARKS.map((l) => ({
    id: `lm-${l.id}`,
    sel: `[data-landmark="${l.id}"]`,
    pulseSel: `[data-lm-pulse="${l.id}"]`,
    point: toMapPoint(l),
  })),
  ...SECONDARY_CITIES.map((c) => ({
    id: `sec-${c.id}`,
    sel: `[data-sec-pin="${c.id}"]`,
    pulseSel: `[data-sec-pulse="${c.id}"]`,
    point: toMapPoint(c),
  })),
]

const FEATHER_MARKUP =
  '<path d="M 0 0 C 3.2 -4.4 10.5 -6.4 16.5 -4.2 C 13.4 0.8 6.2 3 0.2 1.2 Z" fill="#F3BC18" stroke="#C68F0F" stroke-width="0.9" stroke-linejoin="round"/>' +
  '<path d="M -4.5 2.4 L 10.5 -2.2" stroke="#C68F0F" stroke-width="1.1" stroke-linecap="round"/>'

const SVG_NS = 'http://www.w3.org/2000/svg'

// Вся хореография птицы: интро, автоперелёты раз в ~3 сек, золотой след,
// пёрышки открывают лендмарки и второстепенные города, клик = следующий этап
// (+пауза автоплея 10 сек), после финала — свободные перелёты. На привале
// птица следит глазами за курсором. Десктоп и мобила используют один
// контроллер; мобила дополнительно панорамирует карту и листает кнопками.
export const useBirdJourney = (isMobile: boolean) => {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)

  const [card, setCard] = useState<IJourneyCity | null>(null)
  const [panCity, setPanCity] = useState<IJourneyCity>(JOURNEY[0])
  const [completed, setCompleted] = useState(false)

  // Прогресс живёт в ref-ах, чтобы пересоздание gsap-контекста (смена
  // брейкпоинта, fast refresh) восстанавливало картину без повторного интро.
  const routeIndexRef = useRef(0)
  const posRef = useRef<{ kind: 'route' | 'secondary'; index: number } | null>(null)
  const visitedRef = useRef<Set<number>>(new Set())
  const drawnRef = useRef<Set<number>>(new Set())
  const revealedRef = useRef<Set<string>>(new Set())
  const completedRef = useRef(false)
  const introDoneRef = useRef(false)
  const pauseUntilRef = useRef(0)

  const apiRef = useRef<{
    advance: () => void
    back: () => void
    flyToRoute: (i: number) => void
    flyToSecondary: (i: number) => void
  } | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return
    const isMob = isMobile

    const ctx = gsap.context((self) => {
      const q = self!.selector!
      const bird = q('[data-bird]')[0] as HTMLDivElement | undefined
      const fly = q('[data-bird-fly]')[0] as HTMLDivElement | undefined
      const inner = q('[data-bird-inner]')[0] as SVGGElement | undefined
      const face = q('[data-bird-face]')[0] as SVGGElement | undefined
      const wing = q('[data-wing]')[0] as SVGGElement | undefined
      const wingFar = q('[data-wing-far]')[0] as SVGGElement | undefined
      const tail = q('[data-tail]')[0] as SVGGElement | undefined
      const pupils = q('[data-pupils]')[0] as SVGGElement | undefined
      const blink = q('[data-blink]')[0] as SVGCircleElement | undefined
      const trails = q('[data-trail]') as SVGPathElement[]
      const flights = q('[data-flight]') as SVGPathElement[]
      const dynGroup = q('[data-dyn-trails]')[0] as SVGGElement | undefined
      const feathersLayer = q('[data-feathers]')[0] as SVGGElement | undefined
      const pills = q('[data-city-pin]') as HTMLElement[]
      const dots = q('[data-city-dot]') as HTMLElement[]
      const pulses = q('[data-city-pulse]') as HTMLElement[]
      const phrase = q('[data-phrase]')[0] as HTMLElement | undefined
      if (!bird || !fly || !inner || !face || !trails.length || !flights.length) return

      const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const speed = reduced ? 0.12 : 1

      const trailLens = trails.map((t) => t.getTotalLength())
      const flightLens = flights.map((f) => f.getTotalLength())
      trails.forEach((t, i) => {
        gsap.set(t, {
          strokeDasharray: trailLens[i],
          strokeDashoffset: drawnRef.current.has(i) ? 0 : trailLens[i],
          opacity: 1,
        })
      })

      let facing = 1
      gsap.set(face, { transformOrigin: '50% 50%', scaleX: facing })

      const placeBird = (city: { x: number; y: number }) => {
        gsap.set(bird, { left: `${city.x}%`, top: `${city.y - LIFT_PCT}%` })
        gsap.set(fly, { x: 0, y: 0, rotation: 0 })
      }

      const cityOf = (t: { kind: 'route' | 'secondary'; index: number }) =>
        t.kind === 'route' ? JOURNEY[t.index] : SECONDARY_CITIES[t.index]

      // Взмахи: ближнее крыло + дальнее в лёгком противофазном сдвиге.
      // На привале крылья сложены (таймлайн на паузе), изредка — встряхивание.
      const flapTl = gsap.timeline({ repeat: -1, paused: true })
      if (wing) {
        gsap.set(wing, { svgOrigin: '77 55' })
        flapTl.to(wing, { rotation: 56, duration: 0.15, ease: 'sine.in' }, 0)
        flapTl.to(wing, { rotation: 0, duration: 0.18, ease: 'sine.out' }, 0.15)
      }
      if (wingFar) {
        gsap.set(wingFar, { svgOrigin: '89 52' })
        flapTl.to(wingFar, { rotation: 46, duration: 0.15, ease: 'sine.in' }, 0.04)
        flapTl.to(wingFar, { rotation: 0, duration: 0.18, ease: 'sine.out' }, 0.19)
      }

      const foldWings = () => {
        flapTl.pause()
        if (wing) gsap.to(wing, { rotation: 0, duration: 0.25, ease: 'sine.out' })
        if (wingFar) gsap.to(wingFar, { rotation: 0, duration: 0.25, ease: 'sine.out' })
      }

      let shiverCall: gsap.core.Tween | null = null
      const scheduleShiver = () => {
        shiverCall = gsap.delayedCall(gsap.utils.random(3, 6.5), () => {
          if (!flying && wing)
            gsap.fromTo(wing, { rotation: 0 }, { rotation: -6, duration: 0.07, yoyo: true, repeat: 3, ease: 'sine.inOut' })
          scheduleShiver()
        })
      }
      if (!reduced) scheduleShiver()

      if (tail) {
        gsap.set(tail, { svgOrigin: '52 78' })
        gsap.to(tail, { rotation: 6, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: reduced })
      }

      const bob = gsap.to(inner, {
        y: -4,
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        paused: reduced,
      })
      void bob

      let blinkCall: gsap.core.Tween | null = null
      if (blink) gsap.set(blink, { scaleY: 0, svgOrigin: '103 23.8' })
      const scheduleBlink = () => {
        blinkCall = gsap.delayedCall(gsap.utils.random(2.2, 4.8), () => {
          if (blink)
            gsap
              .timeline()
              .to(blink, { scaleY: 1, duration: 0.07 })
              .to(blink, { scaleY: 0, duration: 0.1 }, '+=0.05')
          scheduleBlink()
        })
      }
      if (!reduced) scheduleBlink()

      // Глаза следят за курсором, пока птица отдыхает (только десктоп).
      let followOn = false
      let moveRaf = 0
      let lastMove: MouseEvent | null = null
      const applyFollow = () => {
        moveRaf = 0
        const e = lastMove
        if (!e || !followOn || !pupils) return
        const r = bird.getBoundingClientRect()
        const ex = r.left + r.width / 2
        const ey = r.top + r.height * 0.3
        const dx = e.clientX - ex
        const dy = e.clientY - ey
        const d = Math.hypot(dx, dy) || 1
        const k = Math.min(1, d / 90)
        gsap.to(pupils, {
          x: facing * (dx / d) * 2.3 * k,
          y: (dy / d) * 1.7 * k,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      const onMove = (e: MouseEvent) => {
        lastMove = e
        if (!moveRaf) moveRaf = requestAnimationFrame(applyFollow)
      }
      if (!isMob && !reduced) window.addEventListener('mousemove', onMove, { passive: true })

      let flying: gsap.core.Timeline | null = null
      let restCall: gsap.core.Tween | null = null
      let stActive = true

      const clearRest = () => {
        restCall?.kill()
        restCall = null
      }

      const pulseAt = (el?: Element | null) => {
        if (!el) return
        gsap.fromTo(
          el,
          { scale: 0.35, autoAlpha: 0.9 },
          { scale: 2.6, autoAlpha: 0, duration: 0.9, ease: 'power2.out', overwrite: true },
        )
      }

      const revealPill = (i: number) => {
        if (!pills[i]) return
        gsap.to(pills[i], { autoAlpha: 1, duration: 0.25, ease: 'power2.out' })
        gsap.fromTo(
          q(`[data-city-pill]`)[i] as HTMLElement,
          { scale: 0.6 },
          { scale: 1, duration: 0.5, ease: 'back.out(2.2)' },
        )
        if (dots[i]) gsap.to(dots[i], { backgroundColor: '#F3BC18', duration: 0.4 })
      }

      const drawTrailQuick = (i: number) => {
        if (drawnRef.current.has(i) || !trails[i]) return
        drawnRef.current.add(i)
        gsap.to(trails[i], { strokeDashoffset: 0, duration: 0.5 * speed, ease: 'power1.out' })
      }

      // ── Пёрышки ────────────────────────────────────────────────────────
      // Каждая скрытая точка прикрепляется к ближайшему сегменту полёта;
      // в момент наибольшего сближения с птицы слетает перо и опускается к
      // точке — точка появляется.
      const segTargets = new Map<number, { target: IFeatherTarget; t: number }[]>()
      FEATHER_TARGETS.forEach((target) => {
        let best = { seg: 0, t: 0, d: Infinity }
        flights.forEach((f, si) => {
          for (let s = 0; s <= 30; s++) {
            const p = f.getPointAtLength((s / 30) * flightLens[si])
            const d = Math.hypot(p.x - target.point.x, p.y - target.point.y)
            if (d < best.d) best = { seg: si, t: s / 30, d }
          }
        })
        const list = segTargets.get(best.seg) ?? []
        list.push({ target, t: best.t })
        segTargets.set(best.seg, list)
      })

      const revealTarget = (target: IFeatherTarget) => {
        if (revealedRef.current.has(target.id)) return
        revealedRef.current.add(target.id)
        const el = q(target.sel)[0] as HTMLElement | undefined
        if (!el) return
        gsap.to(el, { autoAlpha: 1, duration: 0.3 })
        gsap.fromTo(el, { scale: 0.3 }, { scale: 1, duration: 0.55, ease: 'back.out(2.4)' })
        pulseAt(q(target.pulseSel)[0] as HTMLElement | undefined)
      }

      const spawnFeather = (target: IFeatherTarget, from: IPoint) => {
        if (revealedRef.current.has(target.id)) return
        if (!feathersLayer || reduced) {
          revealTarget(target)
          return
        }
        const g = document.createElementNS(SVG_NS, 'g')
        g.innerHTML = FEATHER_MARKUP
        const guide = document.createElementNS(SVG_NS, 'path')
        guide.setAttribute('d', curveBetween(from, target.point, gsap.utils.random(0.12, 0.28)))
        guide.setAttribute('fill', 'none')
        guide.setAttribute('stroke', 'none')
        feathersLayer.appendChild(guide)
        feathersLayer.appendChild(g)

        const dist = Math.hypot(target.point.x - from.x, target.point.y - from.y)
        const dur = 1.05 + dist / 650 + gsap.utils.random(0, 0.25)
        const spin = gsap.utils.random(160, 320) * (Math.random() < 0.5 ? -1 : 1)

        gsap.set(g, { scale: gsap.utils.random(0.85, 1.2), transformOrigin: '50% 50%', opacity: 0.95 })
        const tl = gsap.timeline({
          onComplete: () => {
            g.remove()
            guide.remove()
          },
        })
        tl.to(
          g,
          {
            motionPath: { path: guide, align: guide, alignOrigin: [0.5, 0.5] },
            duration: dur,
            ease: 'power1.inOut',
          },
          0,
        )
        tl.fromTo(g, { rotation: gsap.utils.random(-80, 80) }, { rotation: `+=${spin}`, duration: dur, ease: 'none' }, 0)
        tl.call(() => revealTarget(target), [], Math.max(0, dur - 0.15))
        tl.to(g, { opacity: 0, scale: 0.35, duration: 0.28 }, Math.max(0, dur - 0.12))
      }

      const showPhrase = () => {
        if (!phrase) return
        gsap.fromTo(
          phrase,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.85, ease: 'power2.out' },
        )
      }

      const hidePhrase = () => {
        if (phrase) gsap.to(phrase, { autoAlpha: 0, y: 6, duration: 0.3, overwrite: true })
      }

      const finale = () => {
        if (completedRef.current) return
        completedRef.current = true
        setCompleted(true)
        FEATHER_TARGETS.forEach((t) => revealTarget(t))
      }

      const arriveAt = (target: { kind: 'route' | 'secondary'; index: number }) => {
        const city = cityOf(target)
        posRef.current = target
        placeBird(city)
        followOn = true
        if (target.kind === 'route') {
          routeIndexRef.current = target.index
          if (!visitedRef.current.has(target.index)) {
            visitedRef.current.add(target.index)
            revealPill(target.index)
          }
          pulseAt(pulses[target.index])
          if (target.index === LAST) {
            finale()
            showPhrase()
          }
        } else {
          pulseAt(q(`[data-sec-pulse="${city.id}"]`)[0] as HTMLElement | undefined)
        }
        setCard(city)
        scheduleNext()
      }

      const scheduleNext = () => {
        clearRest()
        if (!completedRef.current || isMob) {
          const wait = Math.max(REST_MS, pauseUntilRef.current - Date.now()) / 1000
          restCall = gsap.delayedCall(wait, departNext)
        }
      }

      const departNext = () => {
        if (flying) return
        if (!stActive || document.hidden) {
          clearRest()
          restCall = gsap.delayedCall(0.8, departNext)
          return
        }
        if (Date.now() < pauseUntilRef.current) {
          scheduleNext()
          return
        }
        const cur = posRef.current
        if (!cur) return
        if (cur.kind === 'route' && cur.index === LAST) {
          if (isMob) teleportTo(0)
          return
        }
        const next = cur.kind === 'route' ? cur.index + 1 : routeIndexRef.current + 1
        if (next > LAST) {
          if (isMob) teleportTo(0)
          return
        }
        flyTo({ kind: 'route', index: next })
      }

      const departPrep = () => {
        clearRest()
        setCard(null)
        hidePhrase()
        followOn = false
      }

      const makeDynPath = (d: string, visible: boolean) => {
        if (!dynGroup) return null
        const p = document.createElementNS(SVG_NS, 'path')
        p.setAttribute('d', d)
        p.setAttribute('fill', 'none')
        if (visible) p.setAttribute('class', trails[0]?.getAttribute('class') ?? '')
        else p.setAttribute('stroke', 'none')
        dynGroup.appendChild(p)
        return p
      }

      // Универсальный перелёт: по сегменту маршрута (с отрисовкой следа и
      // пёрышками) или по динамической дуге (свободный режим, временный след).
      const flyTo = (target: { kind: 'route' | 'secondary'; index: number }) => {
        const cur = posRef.current
        if (!cur || flying) return
        if (cur.kind === target.kind && cur.index === target.index) {
          pulseAt(
            target.kind === 'route'
              ? pulses[target.index]
              : (q(`[data-sec-pulse="${cityOf(target).id}"]`)[0] as HTMLElement | undefined),
          )
          setCard(cityOf(target))
          scheduleNext()
          return
        }

        departPrep()
        const toCity = cityOf(target)
        setPanCity(toCity)

        const adjacentForward = cur.kind === 'route' && target.kind === 'route' && target.index === cur.index + 1
        const adjacentBack = cur.kind === 'route' && target.kind === 'route' && target.index === cur.index - 1

        let pathEl: SVGPathElement | null = null
        let reverse = false
        let tempPath: SVGPathElement | null = null
        let tempTrail: SVGPathElement | null = null
        let trailEl: SVGPathElement | null = null
        let trailLen = 0
        let featherDrops: { target: IFeatherTarget; t: number }[] = []
        let featherPathEl: SVGPathElement | null = null
        let featherPathLen = 0

        if (adjacentForward) {
          pathEl = flights[cur.index]
          featherDrops = (segTargets.get(cur.index) ?? []).filter((d) => !revealedRef.current.has(d.target.id))
          featherPathEl = flights[cur.index]
          featherPathLen = flightLens[cur.index]
          if (!drawnRef.current.has(cur.index)) {
            drawnRef.current.add(cur.index)
            trailEl = trails[cur.index]
            trailLen = trailLens[cur.index]
          }
        } else if (adjacentBack) {
          pathEl = flights[target.index]
          reverse = true
        } else {
          const fromPoint = liftedPoint(cityOf(cur))
          tempPath = makeDynPath(flightPathTo(fromPoint, toCity), false)
          pathEl = tempPath
          if (completedRef.current) {
            tempTrail = makeDynPath(curveBetween(toMapPoint(cityOf(cur)), toMapPoint(toCity), 0.14), true)
          } else if (target.kind === 'route') {
            // Прыжок вперёд по маршруту: быстро дорисовываем пропущенные
            // сегменты, показываем их города и раскрываем их точки.
            for (let k = cur.kind === 'route' ? cur.index : routeIndexRef.current; k < target.index; k++) {
              drawTrailQuick(k)
              segTargets.get(k)?.forEach((d) => revealTarget(d.target))
              if (!visitedRef.current.has(k)) {
                visitedRef.current.add(k)
                revealPill(k)
              }
            }
          }
        }
        if (!pathEl) return

        const fromP = liftedPoint(cityOf(cur))
        const toP = liftedPoint(toCity)
        const dist = Math.hypot(toP.x - fromP.x, toP.y - fromP.y)
        const dur = gsap.utils.clamp(0.95, 1.8, dist / 480) * speed
        const dir = toP.x >= fromP.x ? 1 : -1

        flapTl.timeScale(1).play(0)
        if (pupils) gsap.to(pupils, { x: dir * 2.2, y: 0.5, duration: 0.3, overwrite: 'auto' })

        const tl = gsap.timeline({
          onComplete: () => {
            flying = null
            foldWings()
            if (pupils) gsap.to(pupils, { x: 0, y: 0, duration: 0.4, overwrite: 'auto' })
            tempPath?.remove()
            if (tempTrail) {
              gsap.to(tempTrail, {
                opacity: 0,
                duration: 1.4,
                delay: 0.5,
                onComplete: () => tempTrail?.remove(),
              })
            }
            arriveAt(target)
          },
        })
        flying = tl

        if (dir !== facing) {
          tl.to(face, { scaleX: 0, duration: 0.09, ease: 'power1.in' })
          tl.to(face, { scaleX: dir, duration: 0.13, ease: 'power1.out' })
          facing = dir
        }
        tl.to(inner, { scaleY: 0.84, y: 5, duration: 0.14 * speed, ease: 'power1.in' })
        tl.to(inner, { scaleY: 1, y: 0, duration: 0.18 * speed, ease: 'power1.out' })
        tl.addLabel('flight', '>-0.05')
        tl.to(
          fly,
          {
            motionPath: {
              path: pathEl,
              align: pathEl,
              alignOrigin: [0.5, 0.5],
              start: reverse ? 1 : 0,
              end: reverse ? 0 : 1,
            },
            duration: dur,
            ease: 'power1.inOut',
          },
          'flight',
        )
        tl.to(fly, { rotation: dir * 9, duration: dur * 0.35, ease: 'sine.out' }, 'flight')
        tl.to(fly, { rotation: 0, duration: dur * 0.45, ease: 'sine.inOut' }, `flight+=${dur * 0.5}`)
        if (trailEl) {
          tl.fromTo(
            trailEl,
            { strokeDashoffset: trailLen },
            { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' },
            'flight',
          )
        }
        if (tempTrail) {
          const len = tempTrail.getTotalLength()
          gsap.set(tempTrail, { strokeDasharray: len, strokeDashoffset: len })
          tl.to(tempTrail, { strokeDashoffset: 0, duration: dur, ease: 'power1.inOut' }, 'flight')
        }
        featherDrops.forEach(({ target: ft, t }) => {
          const el = featherPathEl
          const len = featherPathLen
          if (!el) return
          tl.call(
            () => {
              const p = el.getPointAtLength(t * len)
              spawnFeather(ft, { x: p.x, y: p.y })
            },
            [],
            `flight+=${Math.min(t * dur, Math.max(0, dur - 0.05))}`,
          )
        })
        tl.to(inner, { scaleY: 0.88, y: 3, duration: 0.12 * speed }, `flight+=${dur}`)
        tl.to(inner, { scaleY: 1, y: 0, duration: 0.22 * speed, ease: 'back.out(2.5)' })
      }

      const teleportTo = (i: number) => {
        if (flying) return
        departPrep()
        const city = JOURNEY[i]
        setPanCity(city)
        const tl = gsap.timeline({
          onComplete: () => {
            flying = null
            arriveAt({ kind: 'route', index: i })
            gsap.fromTo(bird, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' })
          },
        })
        flying = tl
        tl.to(bird, { autoAlpha: 0, y: -10, duration: 0.25 * speed, ease: 'power1.in' })
        tl.call(() => placeBird(city))
      }

      // Любое ручное действие: пауза автоплея 10 сек; если птица уже в
      // воздухе — ускоряем текущий перелёт вместо постановки в очередь.
      const manual = (fn: () => void) => () => {
        if (!introDoneRef.current) return
        pauseUntilRef.current = Date.now() + CLICK_PAUSE_MS
        if (flying) {
          flying.timeScale(2.6)
          return
        }
        clearRest()
        fn()
      }

      const advance = manual(() => {
        if (completedRef.current && !isMob) return
        const cur = posRef.current
        if (!cur) return
        const next = cur.kind === 'route' ? cur.index + 1 : routeIndexRef.current + 1
        if (next > LAST) {
          if (isMob) teleportTo(0)
          return
        }
        flyTo({ kind: 'route', index: next })
      })

      const back = manual(() => {
        const cur = posRef.current
        if (!cur) return
        if (cur.kind === 'route' && cur.index === 0) {
          teleportTo(LAST)
          return
        }
        const prev = cur.kind === 'route' ? cur.index - 1 : routeIndexRef.current
        flyTo({ kind: 'route', index: prev })
      })

      apiRef.current = {
        advance,
        back,
        flyToRoute: (i: number) => manual(() => flyTo({ kind: 'route', index: i }))(),
        flyToSecondary: (i: number) => manual(() => flyTo({ kind: 'secondary', index: i }))(),
      }

      // Стартовое состояние: всё спрятано; при пересоздании контекста
      // восстанавливаем достигнутый прогресс без интро.
      gsap.set(bird, { autoAlpha: 0 })
      pills.forEach((p, i) => gsap.set(p, { autoAlpha: visitedRef.current.has(i) ? 1 : 0 }))
      visitedRef.current.forEach((i) => {
        if (dots[i]) gsap.set(dots[i], { backgroundColor: '#F3BC18' })
      })
      FEATHER_TARGETS.forEach((t) => {
        const el = q(t.sel)[0] as HTMLElement | undefined
        if (el) gsap.set(el, { autoAlpha: revealedRef.current.has(t.id) ? 1 : 0 })
      })
      if (phrase) gsap.set(phrase, { autoAlpha: 0 })

      // IntersectionObserver вместо ScrollTrigger: не боится сдвигов layout
      // от асинхронного контента выше секции и срабатывает сразу, если
      // страница загрузилась с секцией уже в зоне видимости.
      const visIO = new IntersectionObserver(
        (entries) => {
          stActive = entries[entries.length - 1]?.isIntersecting ?? true
        },
        { threshold: 0 },
      )
      visIO.observe(sectionRef.current!)

      const startJourney = () => {
        if (introDoneRef.current) return
        introDoneRef.current = true
        const city = JOURNEY[routeIndexRef.current]
        placeBird(city)
        const tl = gsap.timeline()
        tl.fromTo(
          bird,
          { autoAlpha: 0, y: -70, scale: 0.7 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 * speed, ease: 'back.out(1.5)' },
        )
        tl.call(() => arriveAt({ kind: 'route', index: routeIndexRef.current }), [], '-=0.15')
      }

      let introIO: IntersectionObserver | null = null
      if (introDoneRef.current) {
        const pos = posRef.current ?? { kind: 'route' as const, index: routeIndexRef.current }
        const city = cityOf(pos)
        placeBird(city)
        gsap.set(bird, { autoAlpha: 1 })
        followOn = true
        if (pos.kind === 'route' && !visitedRef.current.has(pos.index)) {
          visitedRef.current.add(pos.index)
          revealPill(pos.index)
        }
        setPanCity(pos.kind === 'route' ? JOURNEY[pos.index] : JOURNEY[routeIndexRef.current])
        setCard(city)
        if (completedRef.current && pos.kind === 'route' && pos.index === LAST && phrase)
          gsap.set(phrase, { autoAlpha: 1 })
        scheduleNext()
      } else {
        // rootMargin -30% снизу ≈ старт, когда верх секции пересёк 70% вьюпорта.
        // Для уже видимой секции колбэк прилетает сразу после observe.
        introIO = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              introIO?.disconnect()
              introIO = null
              startJourney()
            }
          },
          { rootMargin: '0px 0px -30% 0px', threshold: 0 },
        )
        introIO.observe(sectionRef.current!)
      }

      return () => {
        introIO?.disconnect()
        visIO.disconnect()
        clearRest()
        blinkCall?.kill()
        shiverCall?.kill()
        flying?.kill()
        if (moveRaf) cancelAnimationFrame(moveRaf)
        window.removeEventListener('mousemove', onMove)
      }
    }, sectionRef)

    return () => {
      apiRef.current = null
      ctx.revert()
    }
  }, [isMobile])

  const onMapClick = useCallback(() => {
    apiRef.current?.advance()
  }, [])
  const onCityClick = useCallback((i: number) => {
    if (completedRef.current) apiRef.current?.flyToRoute(i)
    else apiRef.current?.advance()
  }, [])
  const onSecondaryClick = useCallback((i: number) => {
    apiRef.current?.flyToSecondary(i)
  }, [])
  const next = useCallback(() => {
    apiRef.current?.advance()
  }, [])
  const prev = useCallback(() => {
    apiRef.current?.back()
  }, [])

  return { sectionRef, pinRef, card, panCity, completed, onMapClick, onCityClick, onSecondaryClick, next, prev }
}
