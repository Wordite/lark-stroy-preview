'use client'

import StorageIcon from '@/assets/icons/storage.svg'
import ArrowDiagonalIcon from '@/assets/icons/arrow_diagonal.svg'
import { Separator } from '@/shared/Separator'
import { ProjectCard } from '@/entities/ProjectCard'
import { useProjectCategoryAnimation } from './model/useProjectCategoryAnimation'

interface IProjectCategoryProps {
  className?: string
}

const ProjectCategory = ({ className }: IProjectCategoryProps) => {
  const { sectionRef, headerRef, cardsRef } = useProjectCategoryAnimation()

  return (
    <section ref={sectionRef} className={`${className}`}>
      <Separator isFullscreen={true} className='-translate-y-[1px] absolute z-[1000]' />
      <div className='pb-[1px]' />

      <div ref={headerRef} className='flex justify-between items-center my-[36px]'>
        <div className='flex items-center gap-[19px]'>
          <StorageIcon className='w-[33px] h-[26px]' />
          <h4 className='w-[700px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Складские комплексы
          </h4>
        </div>

        <ArrowDiagonalIcon className='w-[34px] h-[34px] [&>path]:fill-white' />
      </div>
      <Separator isFullscreen={true} className='translate-y-[1px] relative z-[1000]' />

      <div ref={cardsRef} className='flex'>
        <ProjectCard isHaveRightBorder={true} isOnBoundary={true} boundaryDirection='left' />
        <ProjectCard isHaveRightBorder={true} />
        <ProjectCard isOnBoundary={true} boundaryDirection='right' />
      </div>
    </section>
  )
}

export { ProjectCategory }
