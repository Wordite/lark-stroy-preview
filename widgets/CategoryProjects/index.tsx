'use client'

import { useEffect, useMemo } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { Separator } from '@/shared/Separator'
import { Pagination } from '@/features/Pagination'
import { useCategoryProjectsAnimation } from './model/useCategoryProjectsAnimation'
import { useProjects } from '@/services/entities/projects'
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
        <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
        <div className='py-[40px] text-center text-subtext text-[18px]'>Загрузка…</div>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section ref={sectionRef}>
        <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
        <div className='py-[40px] text-center text-subtext text-[18px]'>
          {(filters.year || filters.city) ? 'По заданным фильтрам ничего не найдено.' : 'В этой категории пока нет проектов.'}
        </div>
      </section>
    )
  }

  const cards = items.map(projectToCardData)

  return (
    <section ref={sectionRef}>
      <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
      <div ref={gridRef} className='grid grid-cols-3 relative'>
        {cards.map((c, i) => {
          const colInRow = i % 3
          const isFirstCol = colInRow === 0
          const isLastCol = colInRow === 2
          return (
            <ProjectCard
              key={c.id}
              data={c}
              className='translate-y-[1px]'
              isHaveRightBorder={!isLastCol}
              isOnBoundary={isFirstCol || isLastCol}
              boundaryDirection={isFirstCol ? 'left' : isLastCol ? 'right' : undefined}
            />
          )
        })}
      </div>
      <Separator className='translate-y-[1px] relative z-[1000]' isFullscreen={true} />

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onChange={goToPage}
          className='mt-[40px]'
        />
      )}
    </section>
  )
}

export { CategoryProjects }
