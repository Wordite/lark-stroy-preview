'use client'

import { ProjectFilters } from '@/features/ProjectFilters'
import StorageIcon from '@/assets/icons/storage.svg'
import { useCategoryHeadAnimation } from './model/useCategoryHeadAnimation'

interface ICategoryHeadProps {
  className?: string
}

const CategoryHead = ({ className }: ICategoryHeadProps) => {
  const { rootRef, titleRef, filtersRef } = useCategoryHeadAnimation()

  return (
    <div ref={rootRef} className={`flex justify-between items-center my-[36px] ${className}`}>
      <div ref={titleRef} className='flex items-center gap-[19px]'>
        <StorageIcon className='w-[33px] h-[26px]' />
        <h4 className='w-[700px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
          Складские комплексы
        </h4>
      </div>

      <div ref={filtersRef}>
        <ProjectFilters />
      </div>
    </div>
  )
}

export { CategoryHead }
