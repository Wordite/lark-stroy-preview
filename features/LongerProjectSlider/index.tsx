'use client'

import { ProjectCard, type IProjectCardData } from '@/entities/ProjectCard'
import { Slider, useSliderSlide } from '@/features/Slider'
import { useRem } from '@/shared/hooks/useRem'
import { useIsMobile } from '@/shared/hooks/useMediaQuery'
import type { ReactNode } from 'react'

interface ILongerProjectSliderProps {
  title: ReactNode
  slides: IProjectCardData[]
  className?: string
}

const CARD_REM = 20.938

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
  const isMobile = useIsMobile()
  return (
    <Slider
      cardWidth={isMobile ? 'container' : rem(CARD_REM)}
      visibleCount={isMobile ? 1 : 4}
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
