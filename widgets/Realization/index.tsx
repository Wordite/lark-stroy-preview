'use client'

import { ProjectCard } from '@/entities/ProjectCard'
import { projectToCardData } from '@/entities/ProjectCard/toCardData'
import { RealizationRoad } from '@/features/RealizationRoad'
import { Separator } from '@/shared/Separator'
import { useRealizationAnimation } from './model/useRealizationAnimation'
import type { HomeBlockPublic } from '@/services/types'

interface IRealizationProps {
  block?: HomeBlockPublic | null
  roadBlock?: HomeBlockPublic | null
}

const Realization = ({ block, roadBlock }: IRealizationProps) => {
  const { sectionRef, titleRef, roadRef, cardsRef } = useRealizationAnimation()
  const projects = block?.projects ?? []
  const cards = projects.slice(0, 3).map(projectToCardData)
  const title = block?.title || 'Реализация объектов'
  const steps = (roadBlock?.config as { steps?: { number: string; title: string; description: string }[] } | undefined)?.steps

  if (cards.length === 0) return null

  return (
    <section ref={sectionRef} className='mt-[4.375rem]'>
      <h4
        ref={titleRef}
        className='w-[31.25rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        {title}
      </h4>

      <div ref={roadRef} className='relative z-[100]'>
        <RealizationRoad className='mt-[2.5rem]' steps={steps} />
      </div>

      <div ref={cardsRef} className='flex max-md:flex-col'>
        {cards.map((c, i) => {
          const isFirst = i === 0
          const isLast = i === cards.length - 1
          return (
            <div key={c.id} className='max-md:contents'>
              {i > 0 && <Separator isFullscreen={true} className='hidden max-md:block' />}
              <ProjectCard
                data={c}
                isHaveRightBorder={!isLast}
                isOnBoundary={isFirst || isLast}
                boundaryDirection={isFirst ? 'left' : isLast ? 'right' : undefined}
              />
            </div>
          )
        })}
      </div>

      <Separator isFullscreen={true} className='-translate-y-[.063rem]' />
    </section>
  )
}

export { Realization }
