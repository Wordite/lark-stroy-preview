'use client'

import { HeroProjectSlider } from '@/features/HeroProjectSlider'
import { HeroProjectSliderControls } from '@/features/HeroProjectSliderControls'
import { Button } from '@/shared/Button'
import { useHeroAnimation } from './model/useHeroAnimation'

const Hero = () => {
  const { slide, tagsRef, titleRef, descRef, buttonsRef } = useHeroAnimation()

  return (
    <section className='h-screen max-h-screen overflow-y-clip relative flex flex-col'>
      <HeroProjectSlider />

      <div ref={tagsRef} className='flex gap-[30px] pt-[180px]'>
        <span className='text-[18px] font-medium text-accent'>{slide.category}</span>
        <span className='text-[18px] font-medium text-accent'>{slide.area}</span>
        <span className='text-[18px] font-medium text-accent'>{slide.city}</span>
      </div>
      <h3
        ref={titleRef}
        className='w-[900px] leading-[1.2em] text-[64px] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
      >
        {slide.title}
      </h3>

      <p
        ref={descRef}
        className='text-[18px] mt-[20px] font-medium text-subtext w-[560px]'
      >
        {slide.description}
      </p>

      <div ref={buttonsRef} className='mt-[22px] flex gap-[15px]'>
        <Button style='accent' isHaveLinkIcon={true}>Обсудить похожий проект</Button>
        <Button style='stroke'>БОЛЬШЕ ПРОИЗВОДСТВ</Button>
      </div>

      <HeroProjectSliderControls className='mt-auto mb-[38px]' />
    </section>
  )
}

export { Hero }
