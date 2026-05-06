'use client'

import { NewsCard, type INewsCardData } from '@/entities/NewsCard'
import { ProjectCard, type IProjectCardData, projectToCardData } from '@/entities/ProjectCard'
import { Slider, useSliderSlide } from '@/features/Slider'
import { PROJECT_SLIDES } from './model/projectSlides'
import type { HomeBlockPublic, News } from '@/services/types'

const CARD_WIDTH = 446
const VISIBLE_COUNT = 3

const FALLBACK_NEWS: INewsCardData = {
  id: 'news-2024',
  title: 'Сделано в этом году',
  description: 'В 2024 году ввели в эксплуатацию более 25 000 м²',
  buttonLabel: 'Читать',
  href: '/news/2024-summary',
}

function newsToCardData(n: News): INewsCardData {
  return {
    id: n.id,
    title: n.title,
    description: n.excerpt ?? '',
    buttonLabel: 'Читать',
    href: `/news/${n.slug}`,
  }
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

interface IWhatWeBuildProps {
  block?: HomeBlockPublic | null
}

const WhatWeBuild = ({ block }: IWhatWeBuildProps = {}) => {
  const newsData = block?.news ? newsToCardData(block.news) : FALLBACK_NEWS
  const projects = block?.projects ?? []
  const projectSlides: IProjectCardData[] =
    projects.length > 0 ? projects.map(projectToCardData) : PROJECT_SLIDES
  const title = block?.title || 'Что мы строим'

  return (
    <Slider
      cardWidth={CARD_WIDTH}
      visibleCount={VISIBLE_COUNT}
      className='mt-[4.375rem]'
      title={
        <h4 className='w-[18.75rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          {title}
        </h4>
      }
    >
      <NewsSlide key={newsData.id} data={newsData} />
      {projectSlides.map((project) => (
        <ProjectSlide key={project.id} data={project} />
      ))}
    </Slider>
  )
}

export { WhatWeBuild }
