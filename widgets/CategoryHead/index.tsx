'use client'

import { ProjectFilters } from '@/features/ProjectFilters'
import StorageIcon from '@/assets/icons/storage.svg'
import { useCategoryHeadAnimation } from './model/useCategoryHeadAnimation'
import type { ProjectCategory as ProjectCategoryType } from '@/services/types'

interface ICategoryHeadProps {
  className?: string
  category?: ProjectCategoryType
  cities?: string[]
}

const CategoryHead = ({ className, category, cities = [] }: ICategoryHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useCategoryHeadAnimation()
  const title = category?.name ?? 'Складские комплексы'

  return (
    <div ref={rootRef} className={`flex justify-between items-center my-[36px] ${className}`}>
      <div ref={titleRef} className='flex items-center gap-[19px]'>
        {category?.iconSvg ? (
          <span
            className='w-[33px] h-[26px] inline-block [&>svg]:w-full [&>svg]:h-full'
            style={{ color: category.color }}
            dangerouslySetInnerHTML={{ __html: category.iconSvg }}
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
