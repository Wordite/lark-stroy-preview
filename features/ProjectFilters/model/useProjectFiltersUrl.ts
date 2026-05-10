'use client'

import { useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface ProjectFiltersUrlState {
  year: string
  type: string
  city: string
  area: string
}

export const EMPTY_FILTERS: ProjectFiltersUrlState = { year: '', type: '', city: '', area: '' }

export function useProjectFiltersUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const value: ProjectFiltersUrlState = {
    year: searchParams.get('year') ?? '',
    type: searchParams.get('type') ?? '',
    city: searchParams.get('city') ?? '',
    area: searchParams.get('area') ?? '',
  }

  const update = useCallback(
    (next: ProjectFiltersUrlState) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next.year) params.set('year', next.year)
      else params.delete('year')
      if (next.type) params.set('type', next.type)
      else params.delete('type')
      if (next.city) params.set('city', next.city)
      else params.delete('city')
      if (next.area) params.set('area', next.area)
      else params.delete('area')
      params.delete('page')

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  return { value, update }
}
