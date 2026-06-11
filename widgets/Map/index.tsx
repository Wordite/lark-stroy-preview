'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Separator } from '@/shared/Separator'
import { useIsMobile } from '@/shared/hooks/useMediaQuery'
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect'
import MapImage from '@/assets/images/map.webp'
import CrimeaShape from '@/assets/images/crimea.svg'
import { useBirdJourney, LIFT_PCT } from './model/useBirdJourney'
import { City } from './ui/City'
import { Landmark } from './ui/Landmark'
import { SecondaryCity } from './ui/SecondaryCity'
import { ProjectCard } from './ui/ProjectCard'
import { Bird } from './ui/Bird'
import {
  JOURNEY,
  SECONDARY_CITIES,
  LANDMARKS,
  TRAIL_SEGMENTS_D,
  FLIGHT_SEGMENTS_D,
  MAP_IMG_W,
  MAP_IMG_H,
} from './model/journey'
import styles from './Map.module.css'

// Смещение панорамы на мобиле: карта едет к текущей цели птицы.
const MOBILE_VERT_BIAS = 10
const FINAL_CITY = JOURNEY[JOURNEY.length - 1]

const Map = () => {
  const isMobile = useIsMobile()

  // Птица — единственный источник правды: карточка и панорама следуют за ней.
  const { sectionRef, pinRef, card, panCity, completed, onMapClick, onCityClick, onSecondaryClick, next, prev } =
    useBirdJourney(isMobile)

  // display держит контент карточки во время fade-out (card = null в полёте).
  const [display, setDisplay] = useState(JOURNEY[0])

  useEffect(() => {
    if (card) setDisplay(card)
  }, [card])

  const panStyle = {
    '--pan-x': `${(0.5 - panCity.x / 100) * 100}%`,
    '--pan-y': `${(0.5 - panCity.y / 100) * 100 + MOBILE_VERT_BIAS}%`,
  } as CSSProperties

  // Позиция кнопок слайдера на мобиле: по умолчанию по центру по вертикали,
  // но не ниже, чем верх карточки + отступ. Высота карточки разная (с фото /
  // без), поэтому меряем её и пересчитываем при смене слайда и высоты вьюпорта
  // (панель браузера).
  const cardRef = useRef<HTMLDivElement>(null)
  const [btnBottom, setBtnBottom] = useState<number | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!isMobile) {
      setBtnBottom(null)
      return
    }
    const container = pinRef.current
    const cardEl = cardRef.current
    if (!container || !cardEl) return

    const compute = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const cardTop = 2.75 * rem + cardEl.offsetHeight + 1.5 * rem // bottom-offset + высота + отступ
      const centered = container.clientHeight / 2 - (4.125 * rem) / 2 // центр минус полкнопки
      setBtnBottom(Math.max(centered, cardTop))
    }
    compute()

    const ro = new ResizeObserver(compute)
    ro.observe(container)
    ro.observe(cardEl)
    window.visualViewport?.addEventListener('resize', compute)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.visualViewport?.removeEventListener('resize', compute)
      window.removeEventListener('resize', compute)
    }
  }, [isMobile, display])

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} w-screen ml-[calc(var(--container-offset)*-1)] relative overflow-clip`}
    >
      <div
        ref={pinRef}
        className='relative w-full h-dvh flex items-center justify-center px-(--container-offset) pt-[7.75rem] pb-[1.5rem] max-md:flex-col max-md:px-0 max-md:pt-0 max-md:pb-[1rem]'
      >
        <div className={styles.titleWrap}>
          <h3
            className='text-[2.5rem] max-md:text-[2.15625rem] font-black leading-[1.15em] whitespace-nowrap'
            style={{ color: 'var(--foreground)' }}
          >
            Путь строителя
          </h3>
          <p className='text-[1.125rem] max-md:text-[1.29375rem] mt-[0.5rem] text-subtext'>
            Республика Крым · 2005–2026
          </p>
        </div>

        <div
          onClick={isMobile ? undefined : onMapClick}
          className={`relative w-full max-w-[65rem] aspect-[1496/882] flex items-center justify-center max-md:max-w-none max-md:aspect-auto max-md:flex-1 max-md:overflow-hidden ${!isMobile && !completed ? 'cursor-pointer' : ''}`}
        >
          <div
            data-map-box
            className={`${styles.mapBoxPan} relative w-full aspect-[1496/882] max-md:w-[230%] max-md:shrink-0 max-md:will-change-transform`}
            style={panStyle}
          >
            <CrimeaShape className={styles.mapShape} aria-hidden preserveAspectRatio='xMidYMid meet' />
            <img
              className={`${styles.mapImage} w-full h-full object-contain pointer-events-none select-none`}
              src={MapImage.src}
              alt='Карта объектов в Крыму'
            />

            {/* Золотой след: сегменты проявляются синхронно с полётом птицы.
                [data-flight] — невидимые дуги повыше, по ним летит птица. */}
            <svg
              viewBox={`0 0 ${MAP_IMG_W} ${MAP_IMG_H}`}
              className='absolute inset-0 z-[2] w-full h-full pointer-events-none overflow-visible'
            >
              {TRAIL_SEGMENTS_D.map((d, i) => (
                <path key={`t${i}`} data-trail d={d} className={styles.trail} style={{ opacity: 0 }} />
              ))}
              {FLIGHT_SEGMENTS_D.map((d, i) => (
                <path key={`f${i}`} data-flight d={d} fill='none' stroke='none' />
              ))}
              <g data-dyn-trails />
              <g data-feathers className={styles.feathers} />
            </svg>

            {LANDMARKS.map((landmark) => (
              <Landmark key={landmark.id} landmark={landmark} />
            ))}

            {JOURNEY.map((city, i) => (
              <City key={city.id} city={city} onSelect={() => onCityClick(i)} active={isMobile && card?.id === city.id} />
            ))}

            {SECONDARY_CITIES.map((city, i) => (
              <SecondaryCity key={city.id} city={city} onSelect={() => onSecondaryClick(i)} />
            ))}

            <div
              data-phrase
              className={`${styles.phrase} absolute z-[25] pointer-events-none opacity-0`}
              style={{ left: `${FINAL_CITY.x - 2}%`, top: `${FINAL_CITY.y - 12}%` }}
            >
              Куда летим дальше?
            </div>

            <div
              data-bird
              className={`${styles.bird} absolute z-30 w-[4.6rem] h-[4.4rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 max-md:w-[5rem] max-md:h-[4.8rem]`}
              style={{ left: `${JOURNEY[0].x}%`, top: `${JOURNEY[0].y - LIFT_PCT}%` }}
            >
              <div data-bird-fly className='w-full h-full'>
                <Bird />
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки слайдера (мобила): по умолчанию по центру по вертикали; если центр
            оказывается слишком близко к карточке — поднимаются над ней с отступом.
            bottom считается в JS как max(центр, верх карточки + отступ). */}
        {isMobile && (
          <div
            className='absolute inset-x-0 z-50 px-(--container-offset) flex items-center justify-between pointer-events-none transition-[bottom] duration-300'
            style={{ bottom: btnBottom != null ? `${btnBottom}px` : '50%' }}
          >
            <button
              type='button'
              onClick={prev}
              aria-label='Предыдущий объект'
              className={`${styles.sliderBtn} pointer-events-auto flex items-center justify-center w-[4.125rem] h-[4.125rem] rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-sm text-[#1B1F21] cursor-pointer active:scale-95 transition-transform`}
            >
              <svg
                className='w-[1.8rem] h-[1.8rem] -translate-x-[1px]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
              >
                <path d='M15 5l-7 7 7 7' />
              </svg>
            </button>
            <button
              type='button'
              onClick={next}
              aria-label='Следующий объект'
              className={`${styles.sliderBtn} pointer-events-auto flex items-center justify-center w-[4.125rem] h-[4.125rem] rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-sm text-[#1B1F21] cursor-pointer active:scale-95 transition-transform`}
            >
              <svg
                className='w-[1.8rem] h-[1.8rem] translate-x-[1px]'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden
              >
                <path d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>
        )}

        {/* Карточка проекта: появляется на привалах птицы, прячется в полёте */}
        <div className='absolute z-40 bottom-[3.5rem] left-(--container-offset) w-[21rem] max-md:inset-x-0 max-md:bottom-[2.75rem] max-md:w-auto max-md:px-(--container-offset)'>
          <div
            className={`transition-opacity duration-300 ${card !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <div ref={cardRef} key={display.id} className={styles.cardSwap}>
              <ProjectCard city={display} />
            </div>
          </div>
        </div>
      </div>

      <Separator className='absolute bottom-0 left-0 translate-x-0' isFullscreen={true} />
      <Separator className='absolute top-0 left-0 translate-x-0' isFullscreen={true} />
    </section>
  )
}

export { Map }
