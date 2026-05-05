'use client'

import { ProjectCard } from '@/entities/ProjectCard'
import { RealizationRoad } from '@/features/RealizationRoad'
import { Separator } from '@/shared/Separator'
import { useRealizationAnimation } from './model/useRealizationAnimation'

const Realization = () => {
  const { sectionRef, titleRef, roadRef, cardsRef } = useRealizationAnimation()

  return (
    <section ref={sectionRef} className='mt-[70px]'>
      <h4
        ref={titleRef}
        className='w-[500px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        Реализация объектов
      </h4>

      <div ref={roadRef} className='relative z-[100]'>
        <RealizationRoad className='mt-[40px]' />
      </div>

      <div ref={cardsRef} className='flex'>
        <ProjectCard isHaveRightBorder={true} isOnBoundary={true} boundaryDirection='left' />
        <ProjectCard isHaveRightBorder={true} />
        <ProjectCard isOnBoundary={true} boundaryDirection='right' />
      </div>

      <Separator isFullscreen={true} className='-translate-y-[1px]' />
    </section>
  )
}

export { Realization }
