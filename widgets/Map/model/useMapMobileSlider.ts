'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { JOURNEY } from './journey'

const AUTO_INTERVAL = 2000 // мс — автолистание слайдера
const RESUME_DELAY = 10000 // мс — пауза автолистания после ручного нажатия
// Карта на мобиле крупнее (CSS max-md:w-[230%]) и панорамируется через translate
// к текущему городу — без transform: scale, чтобы картинка и пины оставались
// чёткими. Смещение считается как доля уже увеличенного бокса.
const MOBILE_VERT_BIAS = 10

const wrap = (i: number) => ((i % JOURNEY.length) + JOURNEY.length) % JOURNEY.length

// Мобильный слайдер вместо скролл-анимации: карта едет к городу, карточка
// меняется. Автолистание раз в секунду; после ручного нажатия пауза 10 сек,
// затем автолистание возобновляется.
export const useMapMobileSlider = (enabled: boolean) => {
  const [index, setIndex] = useState(0)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
    }
  }, [])

  const startAuto = useCallback(() => {
    if (autoRef.current) return
    autoRef.current = setInterval(() => setIndex((i) => wrap(i + 1)), AUTO_INTERVAL)
  }, [])

  useEffect(() => {
    if (!enabled) return
    startAuto()
    return () => {
      stopAuto()
      if (resumeRef.current) clearTimeout(resumeRef.current)
    }
  }, [enabled, startAuto, stopAuto])

  // Любое ручное действие: останавливаем автолистание и заводим таймер
  // возобновления; повторное нажатие сбрасывает отсчёт заново.
  const pauseThenResume = useCallback(() => {
    stopAuto()
    if (resumeRef.current) clearTimeout(resumeRef.current)
    resumeRef.current = setTimeout(() => startAuto(), RESUME_DELAY)
  }, [startAuto, stopAuto])

  const next = useCallback(() => {
    setIndex((i) => wrap(i + 1))
    pauseThenResume()
  }, [pauseThenResume])

  const prev = useCallback(() => {
    setIndex((i) => wrap(i - 1))
    pauseThenResume()
  }, [pauseThenResume])

  const goTo = useCallback(
    (i: number) => {
      setIndex(wrap(i))
      pauseThenResume()
    },
    [pauseThenResume],
  )

  const city = JOURNEY[index]
  const panStyle = {
    '--pan-x': `${(0.5 - city.x / 100) * 100}%`,
    '--pan-y': `${(0.5 - city.y / 100) * 100 + MOBILE_VERT_BIAS}%`,
  } as CSSProperties

  return { index, next, prev, goTo, panStyle }
}
