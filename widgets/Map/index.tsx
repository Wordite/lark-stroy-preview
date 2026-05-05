'use client'

import Script from 'next/script'
import { useYandexMap } from './model/useYandexMap'
import { Separator } from '@/shared/Separator'
import styles from './Map.module.css'

const Map = () => {
  const { mapContainerRef, sectionRef, infoRef, activePoint, setActivePoint } = useYandexMap()

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
      <div ref={infoRef} className='absolute top-[80px] right-(--container-offset) z-10 max-w-[320px]'>
        <h3 className='text-[36px] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          География объектов
        </h3>
        <p className='text-[18px] mt-[8px] text-subtext'>
          Наши объекты
          <br />в Республике Крым
        </p>
      </div>

      {/* Active point tooltip */}
      {activePoint && (
        <div
          className={`absolute bottom-[60px] left-(--container-offset) z-6000 w-[320px] bg-[rgba(15,15,15,0.95)] backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden ${styles.tooltip}`}
        >
          <div className='h-[160px] bg-black-light flex items-center justify-center'>
            <span className='text-subtext text-[14px]'>Фото объекта</span>
          </div>

          <div className='p-[20px]'>
            <p className='text-[12px] uppercase text-accent font-medium tracking-wider'>{activePoint.category}</p>
            <h4 className='text-[20px] font-bold text-text-white mt-[6px] leading-[1.3em]'>{activePoint.title}</h4>
            <p className='text-[14px] text-subtext mt-[4px]'>{activePoint.description}</p>

            <button className='mt-[16px] flex items-center gap-[8px] text-[14px] font-medium text-accent hover:text-text-white transition-colors duration-300 cursor-pointer'>
              Посмотреть
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <path d='M7 17L17 7M17 7H7M17 7V17' />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setActivePoint(null)}
            className='absolute top-[10px] right-[10px] w-[28px] h-[28px] flex items-center justify-center rounded-full bg-black/50 text-white/60 hover:text-white transition-colors cursor-pointer'
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
