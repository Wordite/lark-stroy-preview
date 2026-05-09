'use client'

import { useMemo, useEffect } from 'react'
import { HeroProjectSlider } from '@/features/HeroProjectSlider'
import { HeroProjectSliderControls } from '@/features/HeroProjectSliderControls'
import { Button } from '@/shared/Button'
import { useHeroAnimation } from './model/useHeroAnimation'
import { projectsToSlides } from './model/useSeedHeroSlides'
import { useHeroSliderStore } from '@/core/store/heroSliderStore'
import type { HomeBlockPublic } from '@/services/types'

interface HeroProps {
  block?: HomeBlockPublic | null
}

const Hero = ({ block }: HeroProps = {}) => {
  const slides = useMemo(
    () => projectsToSlides(block?.projects ?? []),
    [block?.projects],
  )
  const setTotalSlides = useHeroSliderStore((s) => s.setTotalSlides)
  useEffect(() => {
    setTotalSlides(slides.length)
  }, [slides.length, setTotalSlides])

  const { slide, tagsRef, titleRef, descRef, buttonsRef } = useHeroAnimation(slides)

  if (!slide) return null

  return (
    <section className='h-screen max-h-screen overflow-y-clip relative flex flex-col'>
      <HeroProjectSlider slides={slides} />

      <div ref={tagsRef} className='flex gap-[1.875rem] pt-[11.25rem] max-md:mt-auto'>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.activity}</span>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.area}</span>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.city}</span>
      </div>
      <h3
        ref={titleRef}
        className='w-[56.25rem] max-md:w-full leading-[1.2em] text-[4rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
      >
        {slide.title}
      </h3>

      <p
        ref={descRef}
        className='text-[1.125rem] mt-[1.25rem] font-medium text-subtext w-[35rem]'
      >
        {slide.description}
      </p>

      <div ref={buttonsRef} className='mt-[1.375rem] flex gap-[.938rem] max-md:flex-col max-md:mt-[4rem]'>
        <Button style='accent' isHaveLinkIcon={true} href='/contacts'>Обсудить похожий проект</Button>
        <Button style='stroke' href={slide.href ?? '/projects'}>Подробнее о проекте</Button>
      </div>

      <HeroProjectSliderControls slides={slides} className='mt-auto mb-[2.375rem]' />
    </section>
  )
}

export { Hero }
