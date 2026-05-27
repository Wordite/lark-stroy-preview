'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useYandexMap } from './model/useYandexMap'
import { Separator } from '@/shared/Separator'
import { SelectDropdown } from '@/shared/SelectDropdown'
import DiagonalArrowIcon from '@/assets/icons/arrow_diagonal.svg'
import styles from './Map.module.css'

interface MapProps {
  points?: import('@/services/types').MapPoint[]
}

const Map = ({ points }: MapProps = {}) => {
  const {
    mapContainerRef,
    sectionRef,
    infoRef,
    activePoint,
    setActivePoint,
    activities,
    selectedActivity,
    setSelectedActivity,
    zoomIn,
    zoomOut,
  } = useYandexMap(points)

  const activityOptions = activities.map((a) => ({ value: a.slug, label: a.title }))

  const [interactive, setInteractive] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) setInteractive(false)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [sectionRef])

  return (
    <section ref={sectionRef} className='w-screen -translate-x-(--container-offset) h-screen max-h-screen overflow-y-clip relative'>
      {/* Map. Скрипт ymaps грузится из useYandexMap руками, чтобы при возврате
          на главную страницу карта поднималась с нуля (next/script дедуплицирует
          и кешит window.ymaps, из-за чего на revisit ломалась смена категорий). */}
      <div ref={mapContainerRef} className={`absolute inset-0 ${styles.mapContainer}`} />

      {/* Mobile-only "tap to activate" overlay: lets the page scroll past the map
          until the user explicitly opts into map interaction. */}
      {!interactive && (
        <button
          type='button'
          onClick={() => setInteractive(true)}
          aria-label='Активировать карту'
          className='absolute inset-0 z-20 md:hidden flex items-end justify-center pb-[5rem] bg-transparent cursor-pointer'
        >
          <span className='px-[1rem] py-[.625rem] rounded-full bg-background/85 backdrop-blur-md border border-light-gray-tranpsparent-40 text-[.875rem] text-foreground font-medium pointer-events-none'>
            Нажмите, чтобы взаимодействовать с картой
          </span>
        </button>
      )}

      {/* Release button shown after activation so user can resume page scroll.
          Fixed-positioned so it stays visible even if user pans the map; pulsing
          border draws attention so the exit is obvious. */}
      {interactive && (
        <button
          type='button'
          onClick={() => setInteractive(false)}
          aria-label='Закрыть карту'
          className={`md:hidden fixed top-[1rem] left-[1rem] z-[9999] px-[.875rem] py-[.5rem] rounded-full bg-background/90 backdrop-blur-md border-[.125rem] text-[.875rem] text-foreground font-medium cursor-pointer flex items-center gap-[.375rem] shadow-lg ${styles.exitPulse}`}
        >
          <span aria-hidden>✕</span>
          Выйти из карты
        </button>
      )}

      {/* Info overlay */}
      <div ref={infoRef} className='absolute top-[5rem] right-(--container-offset) z-10 flex flex-col items-end text-right max-md:top-[6rem]'>
        <h3 className='text-[2.75rem] max-md:text-[1.875rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] whitespace-nowrap max-md:whitespace-normal'>
          География объектов
        </h3>
        <p className='text-[1.125rem] mt-[.5rem] text-subtext'>
          Наши объекты
          <br />в Республике Крым
        </p>

        {activityOptions.length > 0 && (
          <SelectDropdown
            compact
            options={activityOptions}
            value={selectedActivity}
            onChange={setSelectedActivity}
            className='mt-[1.25rem] bg-background/90 backdrop-blur-md'
          />
        )}
      </div>

      {/* Active point tooltip */}
      {activePoint && (
        <div
          className={`absolute bottom-[3.75rem] left-(--container-offset) z-6000 w-[20rem] bg-background/95 backdrop-blur-xl border border-light-gray-tranpsparent-40 rounded-xl overflow-hidden ${styles.tooltip}`}
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
                <DiagonalArrowIcon className='w-[.875rem] h-[.875rem] [&_path]:fill-accent [&_rect]:fill-accent' />
              </Link>
            )}
          </div>

          <button
            onClick={() => setActivePoint(null)}
            className='absolute top-[.625rem] right-[.625rem] w-[1.75rem] h-[1.75rem] flex items-center justify-center rounded-full bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors cursor-pointer'
          >
            ✕
          </button>
        </div>
      )}

      {/* Zoom controls */}
      <div className='absolute bottom-[3.75rem] right-(--container-offset) z-10 flex flex-col gap-[.5rem]'>
        <button
          type='button'
          onClick={zoomIn}
          aria-label='Приблизить'
          className='w-[3rem] h-[3rem] flex items-center justify-center border-[.063rem] border-light-gray-tranpsparent-40 bg-background/90 backdrop-blur-md text-foreground text-[1.5rem] leading-none transition-colors duration-200 hover:border-accent hover:text-accent cursor-pointer'
        >
          +
        </button>
        <button
          type='button'
          onClick={zoomOut}
          aria-label='Отдалить'
          className='w-[3rem] h-[3rem] flex items-center justify-center border-[.063rem] border-light-gray-tranpsparent-40 bg-background/90 backdrop-blur-md text-foreground text-[1.5rem] leading-none transition-colors duration-200 hover:border-accent hover:text-accent cursor-pointer'
        >
          −
        </button>
      </div>

      <Separator className='absolute bottom-0 left-0 translate-x-0' isFullscreen={true} />
      <Separator className='absolute top-0 left-0 translate-x-0' isFullscreen={true} />
    </section>
  )
}

export { Map }
