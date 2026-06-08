'use client'

import styles from '../../Map.module.css'

interface ICityProps {
  city: { id: string; name: string; x: number; y: number }
  onSelect?: () => void
  // Главный город-метка: появляется после анимации, без клика и карточки.
  main?: boolean
  // Активный город (мобильный слайдер): пилюля подсвечивается синим.
  active?: boolean
}

const City = ({ city, onSelect, main, active }: ICityProps) => {
  const clickable = !!onSelect && !main
  const pinProps = main ? { 'data-main-city': '' } : { 'data-city-pin': '' }

  return (
    <div
      {...pinProps}
      className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 ${clickable ? '' : 'pointer-events-none'} ${main ? 'opacity-0' : ''}`}
      style={{ left: `${city.x}%`, top: `${city.y}%` }}
    >
      <button
        type='button'
        onClick={clickable ? onSelect : undefined}
        disabled={!clickable}
        data-city-pill
        className={`${active ? styles.cityPinActive : styles.cityPin} flex items-center gap-[0.5rem] bg-[rgba(255,255,255,0.9)] backdrop-blur-sm pl-[0.625rem] pr-[0.875rem] py-[0.5rem] rounded-[1.875rem] whitespace-nowrap transition-all duration-200 max-md:gap-[0.4rem] max-md:pl-[0.55rem] max-md:pr-[0.75rem] max-md:py-[0.4rem] ${clickable ? 'cursor-pointer hover:bg-white' : 'cursor-default'}`}
      >
        <span className='w-[0.5rem] h-[0.5rem] rounded-full bg-[#5b8def] max-md:w-[0.58rem] max-md:h-[0.58rem]' />
        <span className='font-semibold text-[0.9375rem] text-[#1B1F21] leading-none max-md:text-[0.95rem]'>{city.name}</span>
      </button>
    </div>
  )
}

export { City }
