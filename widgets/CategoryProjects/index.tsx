'use client'

import { useMemo } from 'react'
import { ProjectCard, projectToCardData } from '@/entities/ProjectCard'
import { Separator } from '@/shared/Separator'
import { Button } from '@/shared/Button'
import { useCategoryProjectsAnimation } from './model/useCategoryProjectsAnimation'
import { useInfiniteProjects, useProjects } from '@/services/entities/projects'
import { useProjectFiltersUrl } from '@/features/ProjectFilters/model/useProjectFiltersUrl'
import type { Project } from '@/services/types'

interface CategoryProjectsProps {
  projects?: Project[]
  categorySlug?: string
  pageSize?: number
}

const CategoryProjects = ({
  projects: initial = [],
  categorySlug,
  pageSize = 12,
}: CategoryProjectsProps) => {
  const { sectionRef, gridRef } = useCategoryProjectsAnimation()
  const { value: filters } = useProjectFiltersUrl()

  const isFiltered = !!(filters.year || filters.city)

  // When any filter is active, we ignore the SSR-rendered initial set and use
  // a regular query so results match the filters. Otherwise, pagination uses
  // initial (page 1) + infinite query starting at page 2.
  const filtered = useProjects(
    isFiltered
      ? {
          categorySlug,
          limit: pageSize,
          page: 1,
          year: filters.year ? Number(filters.year) : undefined,
          city: filters.city || undefined,
        }
      : { categorySlug, limit: pageSize, page: 1 },
  )

  const infinite = useInfiniteProjects({ categorySlug, limit: pageSize }, 2)

  const allProjects = useMemo<Project[]>(() => {
    if (isFiltered) return filtered.data?.items ?? []
    const more = infinite.data?.pages.flatMap((p) => p.items) ?? []
    return [...initial, ...more]
  }, [isFiltered, filtered.data, initial, infinite.data])

  if (isFiltered && filtered.isLoading) {
    return (
      <section ref={sectionRef}>
        <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
        <div className='py-[40px] text-center text-subtext text-[18px]'>Загрузка…</div>
      </section>
    )
  }

  if (!allProjects.length) {
    return (
      <section ref={sectionRef}>
        <Separator className='translate-y-[2px] relative z-[1000]' isFullscreen={true} />
        <div className='py-[40px] text-center text-subtext text-[18px]'>
          {isFiltered ? 'По заданным фильтрам ничего не найдено.' : 'В этой категории пока нет проектов.'}
        </div>
      </section>
    )
  }

  const cards = allProjects.map(projectToCardData)

  const lastApiPage = infinite.data?.pages.at(-1)
  const fetchedSomething = !!lastApiPage
  const canLoadMore =
    !isFiltered &&
    !!categorySlug &&
    (fetchedSomething
      ? lastApiPage!.pagination.page < lastApiPage!.pagination.totalPages
      : initial.length >= pageSize)

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

      {canLoadMore && (
        <div className='flex justify-center mt-[40px]'>
          <Button
            style='accent'
            onClick={() => infinite.fetchNextPage()}
            disabled={infinite.isFetchingNextPage}
          >
            {infinite.isFetchingNextPage ? 'Загрузка…' : 'Показать ещё'}
          </Button>
        </div>
      )}
    </section>
  )
}

export { CategoryProjects }
