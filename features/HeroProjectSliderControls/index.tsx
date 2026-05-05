'use client'

import { SliderButton } from '@/entities/SliderButton'
import { Separator } from '@/shared/Separator'
import { useControlsAnimation } from './model/useControlsAnimation'

interface IHeroProjectSliderControlsProps {
  className?: string
}

const HeroProjectSliderControls = ({ className }: IHeroProjectSliderControlsProps) => {
  const { slide, displaySlide, totalSlides, activeSlide, next, prev, yearRef, counterRef } = useControlsAnimation()

  return (
    <div className={`h-[70px] flex flex-col justify-between ${className}`}>
      <Separator isFullscreen={true} />
      <div className='flex justify-between items-center'>
        <span ref={yearRef}>Реализован в {slide.year} году</span>

        <div className='flex gap-[15px] items-center'>
          <p ref={counterRef} className='text-[18px] font-medium'>
            <span className='text-text-white'>{displaySlide}</span>
            {' '}
            <span className='text-light-gray'>/ {totalSlides}</span>
          </p>
          <SliderButton onClick={prev} disabled={activeSlide <= 1} />
          <SliderButton direction='right' variant='accent' onClick={next} disabled={activeSlide >= totalSlides} />
        </div>
      </div>

      <Separator isFullscreen={true} />
    </div>
  )
}

export { HeroProjectSliderControls }
