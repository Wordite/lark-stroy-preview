'use client'

import { Separator } from '@/shared/Separator'
import MapImage from '@/assets/images/map.webp'
import CrimeaShape from '@/assets/images/crimea.svg'
import { useMapJourneyAnimation } from './model/useMapJourneyAnimation'
import { City } from './ui/City'
import { Landmark } from './ui/Landmark'
import { ProjectCard } from './ui/ProjectCard'
import { JOURNEY, LANDMARKS, ROUTE_PATH, MAP_IMG_W, MAP_IMG_H } from './model/journey'
import styles from './Map.module.css'

const Map = () => {
  const { sectionRef, pinRef } = useMapJourneyAnimation()

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} w-screen ml-[calc(var(--container-offset)*-1)] relative overflow-clip`}
    >
      <div
        ref={pinRef}
        className='relative w-full h-screen flex items-center justify-center px-(--container-offset) pt-[7.75rem] pb-[1.5rem] max-md:flex-col max-md:px-0 max-md:pt-0 max-md:pb-[1rem]'
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
          <div data-map-box className='relative w-full aspect-[1496/882] max-md:will-change-transform'>
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
                strokeDasharray='2 20'
                mask='url(#routeReveal)'
                style={{ opacity: 0 }}
              />
            </svg>

            {LANDMARKS.map((landmark) => (
              <Landmark key={landmark.id} landmark={landmark} />
            ))}

            {JOURNEY.map((city) => (
              <City key={city.id} city={city} />
            ))}
          </div>
        </div>

        {/* Враппер карточек — абсолютно на всю ширину секции */}
        <div className='absolute z-50 bottom-[3.5rem] pointer-events-none left-(--container-offset) w-[21rem] max-md:inset-x-0 max-md:bottom-[2rem] max-md:w-auto'>
          {JOURNEY.map((city) => (
            <div
              key={city.id}
              data-project-card
              className='absolute bottom-0 left-0 w-full opacity-0 max-md:px-(--container-offset)'
            >
              <ProjectCard city={city} />
            </div>
          ))}
        </div>
      </div>

      <Separator className='absolute bottom-0 left-0 translate-x-0' isFullscreen={true} />
      <Separator className='absolute top-0 left-0 translate-x-0' isFullscreen={true} />
    </section>
  )
}

export { Map }
