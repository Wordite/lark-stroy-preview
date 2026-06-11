'use client'

import styles from '../../Map.module.css'

interface ICityProps {
  city: { id: string; name: string; x: number; y: number }
  onSelect?: () => void
  // Активный город (мобила): пилюля подсвечивается золотым кольцом.
  active?: boolean
}

// Город маршрута. Скрыт до прилёта птицы (autoAlpha управляет useBirdJourney),
// точка в пилюле становится золотой после визита, кольцо — пульс при посадке.
const City = ({ city, onSelect, active }: ICityProps) => {
  return (
    <div
      data-city-pin
      className='absolute -translate-x-1/2 -translate-y-1/2 z-20 opacity-0'
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
    >
      <span className={`${styles.pulseRing} absolute left-1/2 top-1/2 w-[2.4rem] h-[2.4rem]`} data-city-pulse />
      <button
        type='button'
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
        data-city-pill
        className={`${active ? styles.cityPinActive : styles.cityPin} relative flex items-center gap-[0.5rem] bg-[rgba(255,255,255,0.9)] backdrop-blur-sm pl-[0.625rem] pr-[0.875rem] py-[0.5rem] rounded-[1.875rem] whitespace-nowrap transition-all duration-200 max-md:gap-[0.4rem] max-md:pl-[0.55rem] max-md:pr-[0.75rem] max-md:py-[0.4rem] cursor-pointer hover:bg-white`}
      >
        <span
          data-city-dot
          className='w-[0.5rem] h-[0.5rem] rounded-full bg-[#5b8def] max-md:w-[0.58rem] max-md:h-[0.58rem]'
        />
        <span className='font-semibold text-[0.9375rem] text-[#1B1F21] leading-none max-md:text-[0.95rem]'>{city.name}</span>
      </button>
    </div>
  )
}

export { City }
