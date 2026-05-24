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
          <h4 className='w-[43.75rem] max-md:w-full max-md:text-[1.5rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            {title}
          </h4>
        </div>

        <ArrowDiagonalIcon className='w-[2.125rem] h-[2.125rem] [&>path]:fill-white group-hover:[&>path]:fill-accent transition-colors duration-300' />
      </Link>
      <Separator isFullscreen={true} className='relative z-[1000]' />

      <div ref={cardsRef} className='grid grid-cols-3 max-md:flex max-md:flex-col'>
        {Array.from({ length: 3 }).map((_, i) => {
          const c = cards[i]
          const isFirst = i === 0
          const isLast = i === 2
          const nextHasCard = Boolean(cards[i + 1])
          const hasRight = Boolean(c) && nextHasCard && i < 2
          const cellCls = `relative ${hasRight ? 'border-r max-md:border-r-0 border-light-gray-tranpsparent-40' : ''}`
          if (!c) return <div key={`empty-${i}`} className={`${cellCls} max-md:hidden`} />
          return (
            <div key={c.id} className='max-md:contents'>
              {i > 0 && <Separator isFullscreen={true} className='hidden max-md:block' />}
              <div className={cellCls}>
                <ProjectCard
                  data={c}
                  isOnBoundary={isFirst || isLast}
                  boundaryDirection={isFirst ? 'left' : isLast ? 'right' : undefined}
                />
              </div>
            </div>
          )
        })}
      </div>
      <Separator isFullscreen={true} className='relative z-[1000]' />
    </section>
  )
}

export { Activity }
