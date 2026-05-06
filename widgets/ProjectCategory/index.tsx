'use client'

import Link from 'next/link'
import StorageIcon from '@/assets/icons/storage.svg'
import ArrowDiagonalIcon from '@/assets/icons/arrow_diagonal.svg'
import { Separator } from '@/shared/Separator'
import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { useProjectCategoryAnimation } from './model/useProjectCategoryAnimation'
import type { Project, ProjectCategory as ProjectCategoryType } from '@/services/types'

interface IProjectCategoryProps {
  className?: string
  category?: ProjectCategoryType
  projects?: Project[]
}

const ProjectCategory = ({ className, category, projects = [] }: IProjectCategoryProps) => {
  const { sectionRef, headerRef, cardsRef } = useProjectCategoryAnimation()

  const title = category?.name ?? 'Складские комплексы'
  const href = category ? `/projects/${category.slug}` : '#'
  const cards = projects.length > 0 ? projects.slice(0, 3).map(projectToCardData) : null

  return (
    <section ref={sectionRef} className={`${className}`}>
      <Separator isFullscreen={true} className='-translate-y-[.063rem] absolute z-[1000]' />
      <div className='pb-[.063rem]' />

      <Link href={href} ref={headerRef as any} className='flex justify-between items-center my-[2.25rem] group'>
        <div className='flex items-center gap-[1.188rem]'>
          {category?.iconSvg ? (
            <span
              className='w-[2.063rem] h-[1.625rem] inline-block [&>svg]:w-full [&>svg]:h-full'
              style={{ color: category.color }}
              dangerouslySetInnerHTML={{ __html: category.iconSvg }}
            />
          ) : (
            <StorageIcon className='w-[2.063rem] h-[1.625rem]' />
          )}
          <h4 className='w-[43.75rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            {title}
          </h4>
        </div>

        <ArrowDiagonalIcon className='w-[2.125rem] h-[2.125rem] [&>path]:fill-white group-hover:[&>path]:fill-accent transition-colors duration-300' />
      </Link>
      <Separator isFullscreen={true} className='translate-y-[.063rem] relative z-[1000]' />

      <div ref={cardsRef} className='flex'>
        {cards ? (
          cards.map((c, i) => {
            const isFirst = i === 0
            const isLast = i === cards.length - 1
            return (
              <ProjectCard
                key={c.id}
                data={c}
                isHaveRightBorder={!isLast}
                isOnBoundary={isFirst || isLast}
                boundaryDirection={isFirst ? 'left' : isLast ? 'right' : undefined}
              />
            )
          })
        ) : (
          <>
            <ProjectCard isHaveRightBorder={true} isOnBoundary={true} boundaryDirection='left' />
            <ProjectCard isHaveRightBorder={true} />
            <ProjectCard isOnBoundary={true} boundaryDirection='right' />
          </>
        )}
      </div>
    </section>
  )
}

export { ProjectCategory }
