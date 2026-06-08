'use client'

import { useEffect, useState } from 'react'
import { Separator } from '@/shared/Separator'
import { useIsMobile } from '@/shared/hooks/useMediaQuery'
import MapImage from '@/assets/images/map.webp'
import CrimeaShape from '@/assets/images/crimea.svg'
import { useMapJourneyAnimation } from './model/useMapJourneyAnimation'
import { useMapMobileSlider } from './model/useMapMobileSlider'
import { City } from './ui/City'
import { Landmark } from './ui/Landmark'
import { ProjectCard } from './ui/ProjectCard'
import { JOURNEY, LANDMARKS, MAIN_CITIES, ROUTE_PATH, MAP_IMG_W, MAP_IMG_H } from './model/journey'
import styles from './Map.module.css'

const Map = () => {
  const isMobile = useIsMobile()

  // Десктоп: интро-анимация при появлении секции + клики по городам → active.
  // Мобила: слайдер (автолистание + кнопки) сам ведёт текущий город.
  const [active, setActive] = useState<number | null>(null)
  const { sectionRef, pinRef } = useMapJourneyAnimation(setActive)
  const slider = useMapMobileSlider(isMobile)

  // Единый индекс видимой карточки: на мобиле им управляет слайдер.
  const cardActive = isMobile ? slider.index : active
  // display держит контент карточки во время fade-out (десктоп, active = null).
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (cardActive !== null) setDisplay(cardActive)
  }, [cardActive])

  const handleSelect = (i: number) => (isMobile ? slider.goTo(i) : setActive(i))

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

        <div className='relative w-full max-w-[65rem] aspect-[1496/882] flex items-center justify-center max-md:max-w-none max-md:aspect-auto max-md:flex-1 max-md:overflow-hidden'>
          <div
            data-map-box
            className={`${styles.mapBoxPan} relative w-full aspect-[1496/882] max-md:w-[230%] max-md:shrink-0 max-md:will-change-transform`}
            style={slider.panStyle}
          >
            <CrimeaShape className={styles.mapShape} aria-hidden preserveAspectRatio='xMidYMid meet' />
            <img
              className={`${styles.mapImage} w-full h-full object-contain pointer-events-none select-none`}
              src={MapImage.src}
              alt='Карта объектов в Крыму'
            />

            <svg
              viewBox={`0 0 ${MAP_IMG_W} ${MAP_IMG_H}`}
              className='absolute inset-0 z-[2] w-full h-full pointer-events-none overflow-visible'
            >
              <defs>
                <mask id='routeReveal' maskUnits='userSpaceOnUse' x='0' y='0' width={MAP_IMG_W} height={MAP_IMG_H}>
                  <path
                    data-route-mask
                    d={ROUTE_PATH}
                    fill='none'
                    stroke='#fff'
                    strokeWidth={28}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    style={{ strokeDasharray: 100000, strokeDashoffset: 100000 }}
                  />
                </mask>
              </defs>
              <path
                data-route-visible
                d={ROUTE_PATH}
                fill='none'
                stroke='#5b8def'
                strokeWidth={5}
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeDasharray='2 12'
                mask='url(#routeReveal)'
                style={{ opacity: 0 }}
              />
            </svg>

            {LANDMARKS.map((landmark) => (
              <Landmark key={landmark.id} landmark={landmark} />
            ))}

            {JOURNEY.map((city, i) => (
              <City key={city.id} city={city} onSelect={() => handleSelect(i)} active={isMobile && cardActive === i} />
            ))}

            {MAIN_CITIES.map((city) => (
              <City key={city.id} city={city} main />
            ))}
          </div>
        </div>

        {/* Карточка проекта + (на мобиле) кнопки слайдера — единый стек, привязанный
            к низу, с фиксированным отступом между кнопками и карточкой. При изменении
            высоты вьюпорта (панель браузера) стек двигается целиком, поэтому кнопки и
            карточка никогда не перекрываются. */}
        <div className='absolute z-50 bottom-[3.5rem] left-(--container-offset) w-[21rem] max-md:inset-x-0 max-md:bottom-[2.75rem] max-md:w-auto max-md:px-(--container-offset)'>
          {isMobile && (
            <div className='flex items-center justify-between mb-[1.25rem]'>
              <button
                type='button'
                onClick={slider.prev}
                aria-label='Предыдущий объект'
                className={`${styles.sliderBtn} flex items-center justify-center w-[4.125rem] h-[4.125rem] rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-sm text-[#1B1F21] cursor-pointer active:scale-95 transition-transform`}
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
                onClick={slider.next}
                aria-label='Следующий объект'
                className={`${styles.sliderBtn} flex items-center justify-center w-[4.125rem] h-[4.125rem] rounded-full bg-[rgba(255,255,255,0.9)] backdrop-blur-sm text-[#1B1F21] cursor-pointer active:scale-95 transition-transform`}
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
          <div
            className={`transition-opacity duration-300 ${cardActive !== null ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
            <div key={display} className={styles.cardSwap}>
              <ProjectCard city={JOURNEY[display]} />
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
