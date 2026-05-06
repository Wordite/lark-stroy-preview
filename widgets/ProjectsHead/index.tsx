'use client'

import { ProjectFilters } from '@/features/ProjectFilters'
import { useProjectsHeadAnimation } from './model/useProjectsHeadAnimation'
import type { ProjectCategory } from '@/services/types'

interface IProjectsHeadProps {
  className?: string
  categories?: ProjectCategory[]
  cities?: string[]
}

const ProjectsHead = ({ className, categories = [], cities = [] }: IProjectsHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useProjectsHeadAnimation()

  return (
    <div ref={rootRef} className='flex justify-between items-end'>
      <h4
        ref={titleRef}
        className={`w-[18.75rem] mt-[4.375rem] text-[2.813rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] ${className}`}
      >
        Наши проекты
      </h4>

      <div ref={filtersRef}>
        <ProjectFilters categories={categories} cities={cities} />
      </div>
    </div>
  )
}

export { ProjectsHead }
