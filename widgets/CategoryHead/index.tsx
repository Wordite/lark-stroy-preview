'use client'

import { ProjectFilters } from '@/features/ProjectFilters'
import StorageIcon from '@/assets/icons/storage.svg'
import { useCategoryHeadAnimation } from './model/useCategoryHeadAnimation'
import type { Activity as ActivityType } from '@/services/types'

interface ICategoryHeadProps {
  className?: string
  activity?: ActivityType
  cities?: string[]
}

const CategoryHead = ({ className, activity, cities = [] }: ICategoryHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useCategoryHeadAnimation()
  const title = activity?.title ?? 'Складские комплексы'

  return (
    <div ref={rootRef} className={`flex justify-between items-center my-[36px] ${className}`}>
      <div ref={titleRef} className='flex items-center gap-[19px]'>
        {activity?.iconSvg ? (
          <span
            className='w-[33px] h-[26px] inline-block [&>svg]:w-full [&>svg]:h-full'
            style={{ color: activity.color }}
            dangerouslySetInnerHTML={{ __html: activity.iconSvg }}
          />
        ) : (
          <StorageIcon className='w-[33px] h-[26px]' />
        )}
        <h4 className='w-[700px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          {title}
        </h4>
      </div>

      <div ref={filtersRef}>
        <ProjectFilters cities={cities} />
      </div>
    </div>
  )
}

export { CategoryHead }
