'use client'

import { ProjectCard } from '@/entities/ProjectCard'
import { Separator } from '@/shared/Separator'
import { useCategoryProjectsAnimation } from './model/useCategoryProjectsAnimation'

const CategoryProjects = () => {
  const { sectionRef, gridRef } = useCategoryProjectsAnimation()

  return (
    <section ref={sectionRef}>
      <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
      <div ref={gridRef} className='grid grid-cols-3 relative'>
        <ProjectCard
          className='translate-y-[1px]'
          isHaveRightBorder={true}
          isOnBoundary={true}
          boundaryDirection='left'
        />
        <ProjectCard className='translate-y-[1px]' isHaveRightBorder={true} />
        <ProjectCard className='translate-y-[1px]' isOnBoundary={true} boundaryDirection='right' />

        <Separator className='absolute top-1/2 left-0 z-[1000]' isFullscreen={true} />

        <ProjectCard isHaveRightBorder={true} isOnBoundary={true} boundaryDirection='left' />
        <ProjectCard isHaveRightBorder={true} />
        <ProjectCard isOnBoundary={true} boundaryDirection='right' />
      </div>
    </section>
  )
}

export { CategoryProjects }
