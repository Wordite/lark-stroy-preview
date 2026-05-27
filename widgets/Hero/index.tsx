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

      <div ref={tagsRef} className='flex flex-wrap gap-[1.875rem] max-md:gap-x-[1rem] max-md:gap-y-[.5rem] pt-[11.25rem] max-md:pt-0 max-md:mt-auto'>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.activity}</span>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.area}</span>
        <span className='text-[1.125rem] font-medium text-accent'>{slide.city}</span>
      </div>
      <h1
        ref={titleRef}
        className='w-[56.25rem] max-md:w-full leading-[1.2em] text-[4rem] max-md:text-[2.5rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-on-dark) break-words text-wrap max-md:hyphens-auto'
      >
        {slide.title}
      </h1>

      <p
        ref={descRef}
        className='text-[1.125rem] max-md:text-[1.125rem] mt-[1.25rem] max-md:mt-[1.25rem] font-medium text-[var(--color-on-dark-muted)] w-[35rem] max-md:w-full max-md:line-clamp-3 break-words text-wrap'
      >
        {slide.description}
      </p>

      <div ref={buttonsRef} className='mt-[1.375rem] flex gap-[.938rem] max-md:flex-col max-md:mt-[4rem]'>
        <Button
          style='accent'
          isHaveLinkIcon={true}
          href={`/contacts?message=${encodeURIComponent(
            `Здравствуйте! Меня заинтересовал проект «${slide.title}» — хотелось бы обсудить похожий.`,
          )}`}
        >
          Обсудить похожий проект
        </Button>
        <Button
          style='stroke'
          href={slide.href ?? '/projects'}
          className='!border-[var(--color-on-dark)] !text-[var(--color-on-dark)] hover:!bg-[var(--color-on-dark)] hover:!text-text-black'
        >
          Подробнее о проекте
        </Button>
      </div>

      <HeroProjectSliderControls slides={slides} className='mt-auto mb-[2.375rem]' />
    </section>
  )
}

export { Hero }
