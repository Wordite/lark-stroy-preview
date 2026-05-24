'use client'

import { NewsCard, type INewsCardData } from '@/entities/NewsCard'
import { ProjectCard, type IProjectCardData, projectToCardData } from '@/entities/ProjectCard'
import { Slider, useSliderSlide } from '@/features/Slider'
import { useRem } from '@/shared/hooks/useRem'
import { useIsMobile } from '@/shared/hooks/useMediaQuery'
import { mediaUrl } from '@/services/mediaUrl'
import type { HomeBlockPublic, News } from '@/services/types'

const CARD_REM = 27.875

function newsToCardData(n: News): INewsCardData {
  return {
    id: n.id,
    title: n.title,
    description: n.excerpt ?? '',
    buttonLabel: 'Читать',
    href: `/news/${n.slug}`,
    image: mediaUrl(n.image?.url),
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
  const rem = useRem()
  const isMobile = useIsMobile()
  const newsData = block?.news ? newsToCardData(block.news) : null
  const projectSlides: IProjectCardData[] = (block?.projects ?? []).map(projectToCardData)
  const title = block?.title || 'Что мы строим'

  if (!newsData && projectSlides.length === 0) return null

  return (
    <Slider
      cardWidth={isMobile ? 'container' : rem(CARD_REM)}
      visibleCount={isMobile ? 1 : 3}
      className='mt-[4.375rem]'
      title={
        <h4 className='w-[18.75rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          {title}
        </h4>
      }
    >
      {newsData ? <NewsSlide key={newsData.id} data={newsData} /> : null}
      {projectSlides.map((project) => (
        <ProjectSlide key={project.id} data={project} />
      ))}
    </Slider>
  )
}

export { WhatWeBuild }
