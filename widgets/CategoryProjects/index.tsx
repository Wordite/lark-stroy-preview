'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { Separator } from '@/shared/Separator'
import { EmptyState } from '@/shared/EmptyState'
import { Pagination } from '@/features/Pagination'
import { useCategoryProjectsAnimation } from './model/useCategoryProjectsAnimation'
import { useProjects, parseAreaRange } from '@/services/entities/projects'
import { useProjectFiltersUrl } from '@/features/ProjectFilters/model/useProjectFiltersUrl'
import type { Project } from '@/services/types'

interface CategoryProjectsProps {
  projects?: Project[]
  totalPages?: number
  initialPage?: number
  activitySlug?: string
  pageSize?: number
}

const CategoryProjects = ({
  projects: initial = [],
  totalPages: initialTotalPages = 1,
  initialPage = 1,
  activitySlug,
  pageSize = 12,
}: CategoryProjectsProps) => {
  const { sectionRef, gridRef } = useCategoryProjectsAnimation()
  const { value: filters } = useProjectFiltersUrl()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'))
  const useInitial = currentPage === initialPage

  const query = useProjects({
    activitySlug,
    limit: pageSize,
    page: currentPage,
    year: filters.year ? Number(filters.year) : undefined,
    city: filters.city || undefined,
    ...parseAreaRange(filters.area),
  })

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const items = useMemo<Project[]>(() => {
    if (useInitial && !query.data) return initial
    return query.data?.items ?? initial
  }, [useInitial, initial, query.data])

  const totalPages = query.data?.pagination.totalPages ?? initialTotalPages

  useEffect(() => {
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => window.cancelAnimationFrame(id)
  }, [items.length, currentPage, filters.year, filters.city, activitySlug])

  if (!useInitial && query.isLoading) {
    return (
      <section ref={sectionRef}>
        <Separator className='relative z-[1000]' isFullscreen={true} />
        <EmptyState message='Загрузка…' />
        <Separator className='relative z-[1000]' isFullscreen={true} />
      </section>
    )
  }

  if (!items.length) {
    return (
      <section ref={sectionRef}>
        <Separator className='relative z-[1000]' isFullscreen={true} />
        <EmptyState
          message={
            filters.year || filters.city
              ? 'По заданным фильтрам ничего не найдено.'
              : 'В этой категории пока нет проектов.'
          }
        />
        <Separator className='relative z-[1000]' isFullscreen={true} />
      </section>
    )
  }

  const cards = items.map(projectToCardData)

  return (
    <section ref={sectionRef}>
      <Separator className='relative z-[1000]' isFullscreen={true} />
      <div ref={gridRef} className='grid grid-cols-3 relative'>
        {cards.map((c, i) => {
          const colInRow = i % 3
          const isFirstCol = colInRow === 0
          const isLastCol = colInRow === 2
          const hasRight = !isLastCol
          const isNewRowStart = i >= 3 && isFirstCol
          return (
            <div
              key={c.id}
              className={`relative ${hasRight ? 'border-r border-light-gray-tranpsparent-40' : ''}`}
            >
              {isNewRowStart && (
                <div
                  className='absolute top-0 w-screen h-px bg-light-gray-tranpsparent-40 -translate-y-px z-[1] pointer-events-none'
                  style={{ left: 'calc(-1 * var(--container-offset))' }}
                />
              )}
              <ProjectCard
                data={c}
                isOnBoundary={isFirstCol || isLastCol}
                boundaryDirection={isFirstCol ? 'left' : isLastCol ? 'right' : undefined}
              />
            </div>
          )
        })}
      </div>

      {totalPages > 1 ? (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onChange={goToPage}
        />
      ) : (
        <Separator className='relative z-[1000]' isFullscreen={true} />
      )}
    </section>
  )
}

export { CategoryProjects }
