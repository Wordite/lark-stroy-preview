'use client'

import { ProjectFilters } from '@/features/ProjectFilters'
import { useProjectsHeadAnimation } from './model/useProjectsHeadAnimation'

interface IProjectsHeadProps {
  className?: string
}

const ProjectsHead = ({ className }: IProjectsHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useProjectsHeadAnimation()

  return (
    <div ref={rootRef} className='flex justify-between items-end'>
      <h4
        ref={titleRef}
        className={`w-[300px] mt-[70px] text-[45px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] ${className}`}
      >
        Наши проекты
      </h4>

      <div ref={filtersRef}>
        <ProjectFilters />
      </div>
    </div>
  )
}

export { ProjectsHead }
