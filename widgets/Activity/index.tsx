'use client'

import Link from 'next/link'
import StorageIcon from '@/assets/icons/storage.svg'
import ArrowDiagonalIcon from '@/assets/icons/arrow_diagonal.svg'
import { Separator } from '@/shared/Separator'
import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { useActivityAnimation } from './model/useActivityAnimation'
import type { Project, Activity as ActivityType } from '@/services/types'

interface IActivityProps {
  className?: string
  activity?: ActivityType
  projects?: Project[]
}

const Activity = ({ className, activity, projects = [] }: IActivityProps) => {
  const { sectionRef, headerRef, cardsRef } = useActivityAnimation()

  if (!activity) return null
  const title = activity.title
  const href = `/projects/${activity.slug}`
  const cards = projects.slice(0, 3).map(projectToCardData)

  return (
    <section ref={sectionRef} className={`${className}`}>
      <Separator isFullscreen={true} className='-translate-y-[.063rem] absolute z-[1000]' />
      <div className='pb-[.063rem]' />

      <Link href={href} ref={headerRef as any} className='flex justify-between items-center my-[2.25rem] group'>
        <div className='flex items-center gap-[1.188rem]'>
          {activity?.iconSvg ? (
            <span
              className='w-[2.063rem] h-[1.625rem] inline-block [&>svg]:w-full [&>svg]:h-full'
              style={{ color: activity.color }}
              dangerouslySetInnerHTML={{ __html: activity.iconSvg }}
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
        {cards.map((c, i) => {
          const isFirst = i === 0
          const isLast = i === cards.length - 1
          const isFullRow = cards.length === 3
          return (
            <ProjectCard
              key={c.id}
              data={c}
              isHaveRightBorder={!isLast}
              isOnBoundary={isFirst || (isLast && isFullRow)}
              boundaryDirection={isFirst ? 'left' : (isLast && isFullRow) ? 'right' : undefined}
            />
          )
        })}
      </div>
    </section>
  )
}

export { Activity }
