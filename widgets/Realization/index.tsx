'use client'

import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { RealizationRoad } from '@/features/RealizationRoad'
import { Separator } from '@/shared/Separator'
import { useRealizationAnimation } from './model/useRealizationAnimation'
import type { HomeBlockPublic } from '@/services/types'

interface IRealizationProps {
  block?: HomeBlockPublic | null
}

const Realization = ({ block }: IRealizationProps) => {
  const { sectionRef, titleRef, roadRef, cardsRef } = useRealizationAnimation()
  const projects = block?.projects ?? []
  const cards = projects.length > 0 ? projects.slice(0, 3).map(projectToCardData) : null
  const title = block?.title || 'Реализация объектов'

  return (
    <section ref={sectionRef} className='mt-[4.375rem]'>
      <h4
        ref={titleRef}
        className='w-[31.25rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        {title}
      </h4>

      <div ref={roadRef} className='relative z-[100]'>
        <RealizationRoad className='mt-[2.5rem]' />
      </div>

      <div ref={cardsRef} className='flex'>
        {cards ? (
          cards.map((c, i) => {
            const isFirst = i === 0
            const isLast = i === cards.length - 1
            return (
              <ProjectCard
                key={c.id}
                data={c}
                isHaveRightBorder={!isLast}
                isOnBoundary={isFirst || isLast}
                boundaryDirection={isFirst ? 'left' : isLast ? 'right' : undefined}
              />
            )
          })
        ) : (
          <>
            <ProjectCard isHaveRightBorder={true} isOnBoundary={true} boundaryDirection='left' />
            <ProjectCard isHaveRightBorder={true} />
            <ProjectCard isOnBoundary={true} boundaryDirection='right' />
          </>
        )}
      </div>

      <Separator isFullscreen={true} className='-translate-y-[.063rem]' />
    </section>
  )
}

export { Realization }
