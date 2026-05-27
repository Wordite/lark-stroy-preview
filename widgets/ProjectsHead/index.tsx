'use client'

import { ProjectFilters, type AreaBucketOption } from '@/features/ProjectFilters'
import { useProjectsHeadAnimation } from './model/useProjectsHeadAnimation'
import type { Activity } from '@/services/types'

interface IProjectsHeadProps {
  className?: string
  categories?: Activity[]
  cities?: string[]
  areaBuckets?: AreaBucketOption[]
}

const ProjectsHead = ({ className, categories = [], cities = [], areaBuckets }: IProjectsHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useProjectsHeadAnimation()

  return (
    <div ref={rootRef} className='flex mb-[2.5rem] justify-between items-end max-md:flex-col max-md:items-stretch max-md:gap-[1.5rem]'>
      <h1
        ref={titleRef}
        className={`w-[18.75rem] mt-[4.375rem] text-[2.813rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] ${className}`}
      >
        Наши проекты
      </h1>

      <div ref={filtersRef}>
        <ProjectFilters categories={categories} cities={cities} areaBuckets={areaBuckets} />
      </div>
    </div>
  )
}

export { ProjectsHead }
