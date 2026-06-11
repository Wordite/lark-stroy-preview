'use client'

import type { IJourneyCity } from '../../model/journey'
import styles from '../../Map.module.css'

interface ISecondaryCityProps {
  city: IJourneyCity
  onSelect: () => void
}

// Второстепенный город: мягко светящаяся золотая точка. Скрыт, пока к нему
// не прилетит пёрышко птицы (useBirdJourney управляет через data-sec-pin).
// Клик — птица летит сюда.
const SecondaryCity = ({ city, onSelect }: ISecondaryCityProps) => {
  return (
    <div
      data-sec-pin={city.id}
      className='group/sc absolute -translate-x-1/2 -translate-y-1/2 z-20 hover:z-30 opacity-0'
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
    >
      <span
        className={`${styles.pulseRing} absolute left-1/2 top-1/2 w-[2.4rem] h-[2.4rem]`}
        data-sec-pulse={city.id}
      />
      <button
        type='button'
        aria-label={city.name}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
        className='relative flex items-center justify-center w-[1.6rem] h-[1.6rem] cursor-pointer'
      >
        <span
          className={`${styles.secondaryDot} block w-[0.85rem] h-[0.85rem] rounded-full transition-transform duration-200 group-hover/sc:scale-125 max-md:w-[0.95rem] max-md:h-[0.95rem]`}
        />
      </button>
      <span
        className={`${styles.landmarkTip} pointer-events-none absolute left-1/2 bottom-[calc(100%+0.3rem)] -translate-x-1/2 whitespace-nowrap rounded-[1.875rem] bg-[rgba(255,255,255,0.92)] backdrop-blur-sm px-[0.625rem] py-[0.3rem] text-[0.75rem] font-semibold text-[#1B1F21] leading-none opacity-0 translate-y-[0.25rem] transition-all duration-200 group-hover/sc:opacity-100 group-hover/sc:translate-y-0 max-md:text-[0.8rem] max-md:px-[0.6rem]`}
      >
        {city.name}
      </span>
    </div>
  )
}

export { SecondaryCity }
