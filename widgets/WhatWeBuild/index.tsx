'use client'

import { NewsCard, type INewsCardData } from '@/entities/NewsCard'
import { ProjectCard, type IProjectCardData } from '@/entities/ProjectCard'
import { Slider, useSliderSlide } from '@/features/Slider'
import { PROJECT_SLIDES } from './model/projectSlides'

const CARD_WIDTH = 446
const VISIBLE_COUNT = 3

const NEWS_SLIDE: INewsCardData = {
  id: 'news-2024',
  title: 'Сделано в этом году',
  description: 'В 2024 году ввели в эксплуатацию более 25 000 м²',
  buttonLabel: 'Читать',
  href: '/news/2024-summary',
}

const NewsSlide = ({ data }: { data: INewsCardData }) => {
  const { isOnBoundary, boundaryDirection, isHaveRightBorder } = useSliderSlide()
  return (
    <NewsCard
      data={data}
      isOnBoundary={isOnBoundary}
      boundaryDirection={boundaryDirection}
      isHaveRightBorder={isHaveRightBorder}
    />
  )
}

const ProjectSlide = ({ data }: { data: IProjectCardData }) => {
  const { isOnBoundary, boundaryDirection, isHaveRightBorder } = useSliderSlide()
  return (
    <ProjectCard
      data={data}
      isOnBoundary={isOnBoundary}
      boundaryDirection={boundaryDirection}
      isHaveRightBorder={isHaveRightBorder}
    />
  )
}

const WhatWeBuild = () => {
  return (
    <Slider
      cardWidth={CARD_WIDTH}
      visibleCount={VISIBLE_COUNT}
      className='mt-[70px]'
      title={
        <h4 className='w-[300px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          Что мы строим
        </h4>
      }
    >
      <NewsSlide key={NEWS_SLIDE.id} data={NEWS_SLIDE} />
      {PROJECT_SLIDES.map((project) => (
        <ProjectSlide key={project.id} data={project} />
      ))}
    </Slider>
  )
}

export { WhatWeBuild }
