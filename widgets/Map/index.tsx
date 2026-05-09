'use client'

import Script from 'next/script'
import Link from 'next/link'
import { useYandexMap } from './model/useYandexMap'
import { Separator } from '@/shared/Separator'
import styles from './Map.module.css'

interface MapProps {
  points?: import('@/services/types').MapPoint[]
}

const Map = ({ points }: MapProps = {}) => {
  const { mapContainerRef, sectionRef, infoRef, activePoint, setActivePoint } = useYandexMap(points)

  return (
    <section ref={sectionRef} className='w-screen -translate-x-(--container-offset) h-screen max-h-screen overflow-y-clip relative'>
      {/* Yandex Maps API loads only when the Map widget is on the page.
          next/script dedupes by src, so navigation back to the home page
          reuses the already-loaded script. */}
      <Script src='https://api-maps.yandex.ru/2.1/?lang=ru_RU' strategy='afterInteractive' />

      {/* <Separator className='translate-x-(--container-offset)' isFullscreen={true} /> */}

      {/* Map */}
      <div ref={mapContainerRef} className={`absolute inset-0 ${styles.mapContainer}`} />

      {/* Info overlay */}
      <div ref={infoRef} className='absolute top-[5rem] right-(--container-offset) z-10 max-w-[20rem]'>
        <h3 className='text-[2.25rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          География объектов
        </h3>
        <p className='text-[1.125rem] mt-[.5rem] text-subtext'>
          Наши объекты
          <br />в Республике Крым
        </p>
      </div>

      {/* Active point tooltip */}
      {activePoint && (
        <div
          className={`absolute bottom-[3.75rem] left-(--container-offset) z-6000 w-[20rem] bg-[rgba(15,15,15,0.95)] backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden ${styles.tooltip}`}
        >
          <div className='h-[10rem] bg-black-light flex items-center justify-center'>
            {activePoint.imageUrl ? (
              <img src={activePoint.imageUrl} alt={activePoint.title} className='w-full h-full object-cover' />
            ) : (
              <span className='text-subtext text-[.875rem]'>Фото объекта</span>
            )}
          </div>

          <div className='p-[1.25rem]'>
            <p className='text-[.75rem] uppercase text-accent font-medium tracking-wider'>{activePoint.activity}</p>
            <h4 className='text-[1.25rem] font-bold text-text-white mt-[.375rem] leading-[1.3em]'>{activePoint.title}</h4>
            <p className='text-[.875rem] text-subtext mt-[.25rem]'>{activePoint.description}</p>

            {activePoint.href && (
              <Link
                href={activePoint.href}
                className='mt-[1rem] inline-flex items-center gap-[.5rem] text-[.875rem] font-medium text-accent hover:text-text-white transition-colors duration-300 cursor-pointer'
              >
                Посмотреть
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                  <path d='M7 17L17 7M17 7H7M17 7V17' />
                </svg>
              </Link>
            )}
          </div>

          <button
            onClick={() => setActivePoint(null)}
            className='absolute top-[.625rem] right-[.625rem] w-[1.75rem] h-[1.75rem] flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white transition-colors cursor-pointer'
          >
            ✕
          </button>
        </div>
      )}

      <Separator className='absolute bottom-0 left-0 translate-x-0' isFullscreen={true} />
      <Separator className='absolute top-0 left-0 translate-x-0' isFullscreen={true} />
    </section>
  )
}

export { Map }
