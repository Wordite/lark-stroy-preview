'use client'

import type { IJourneyCity } from '../../model/journey'
import styles from '../../Map.module.css'

interface ICityProps {
  city: IJourneyCity
}

const City = ({ city }: ICityProps) => {
  return (
    <div
      data-city-pin
      className='absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none'
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
    >
      <div
        data-city-pill
        className={`${styles.cityPin} flex items-center gap-[0.5rem] bg-[rgba(255,255,255,0.9)] backdrop-blur-sm pl-[0.625rem] pr-[0.875rem] py-[0.5rem] rounded-[1.875rem] whitespace-nowrap max-md:gap-[0.22rem] max-md:pl-[0.32rem] max-md:pr-[0.45rem] max-md:py-[0.22rem]`}
      >
        <span className='w-[0.5rem] h-[0.5rem] rounded-full bg-[#5b8def] max-md:w-[0.32rem] max-md:h-[0.32rem]' />
        <span className='font-semibold text-[0.9375rem] text-[#1B1F21] leading-none max-md:text-[0.55rem]'>{city.name}</span>
      </div>
    </div>
  )
}

export { City }
