'use client'

import { ProjectCard, type IProjectCardData } from '@/entities/ProjectCard'
import { Slider, useSliderSlide } from '@/features/Slider'
import { useRem } from '@/shared/hooks/useRem'
import type { ReactNode } from 'react'

interface ILongerProjectSliderProps {
  title: ReactNode
  slides: IProjectCardData[]
  className?: string
}

const CARD_REM = 20.938
const VISIBLE_COUNT = 4

const ShortProjectSlide = ({ data }: { data: IProjectCardData }) => {
  const { isOnBoundary, boundaryDirection, isHaveRightBorder } = useSliderSlide()
  return (
    <ProjectCard
      data={data}
      isShort
      withoutTags
      isOnBoundary={isOnBoundary}
      boundaryDirection={boundaryDirection}
      isHaveRightBorder={isHaveRightBorder}
    />
  )
}

const LongerProjectSlider = ({ title, slides, className }: ILongerProjectSliderProps) => {
  const rem = useRem()
  return (
    <Slider
      cardWidth={rem(CARD_REM)}
      visibleCount={VISIBLE_COUNT}
      className={className}
      title={title}
    >
      {slides.map((slide) => (
        <ShortProjectSlide key={slide.id} data={slide} />
      ))}
    </Slider>
  )
}

export { LongerProjectSlider }
