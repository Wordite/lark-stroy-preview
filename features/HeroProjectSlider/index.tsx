'use client'

import slideMaskImage from '@/assets/images/hero_slodier_mask.png'
import Image from 'next/image'
import testPhoto from '@/assets/images/test_photo.png'
import { useHeroSliderStore, type IHeroSlide } from '@/core/store/heroSliderStore'

export type { IHeroSlide }

interface IHeroProjectSliderProps {
  slides: IHeroSlide[]
}

const HeroProjectSlider = ({ slides }: IHeroProjectSliderProps) => {
  const activeSlide = useHeroSliderStore((s) => s.activeSlide)

  return (
    <div className='absolute -left-(--container-offset) w-screen h-screen -z-50 overflow-hidden'>
      <Image className='absolute w-screen h-screen z-10' src={slideMaskImage} alt='mask' />
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            slide.id === activeSlide
              ? 'opacity-100 scale-100'
              : slide.id < activeSlide
                ? 'opacity-0 scale-105 -translate-x-[5%]'
                : 'opacity-0 scale-105 translate-x-[5%]'
          }`}
        >
          {slide.imageUrl ? (
            <img
              className={`w-screen h-screen object-cover ${slide.color}`}
              src={slide.imageUrl}
              alt={slide.title}
            />
          ) : (
            <Image
              className={`w-screen h-screen object-cover ${slide.color}`}
              src={testPhoto}
              alt={slide.title}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export { HeroProjectSlider }
