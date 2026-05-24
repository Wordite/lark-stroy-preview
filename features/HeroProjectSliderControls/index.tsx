'use client'

import { SliderButton } from '@/entities/SliderButton'
import { Separator } from '@/shared/Separator'
import { useControlsAnimation } from './model/useControlsAnimation'
import type { IHeroSlide } from '@/core/store/heroSliderStore'

interface IHeroProjectSliderControlsProps {
  slides: IHeroSlide[]
  className?: string
}

const HeroProjectSliderControls = ({ slides, className }: IHeroProjectSliderControlsProps) => {
  const { slide, displaySlide, totalSlides, activeSlide, next, prev, yearRef, counterRef } = useControlsAnimation(slides)

  if (!slide) return null

  return (
    <div className={`h-[4.375rem] flex flex-col justify-between text-[var(--color-on-dark)] ${className}`}>
      <Separator isFullscreen={true} />
      <div className='flex justify-between items-center'>
        <span ref={yearRef}>Реализован в {slide.year} году</span>

        <div className='flex gap-[.938rem] items-center'>
          <p ref={counterRef} className='text-[1.125rem] font-medium'>
            <span className='text-[var(--color-on-dark)]'>{displaySlide}</span>
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
