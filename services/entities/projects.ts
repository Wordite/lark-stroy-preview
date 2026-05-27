import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api } from '../api'
import type { MapPoint, Paginated, Project } from '../types'

export interface ProjectQuery {
  page?: number
  limit?: number
  activitySlug?: string
  search?: string
  city?: string
  year?: number
  areaMin?: number
  areaMax?: number
}

function qs(params: ProjectQuery) {
  const s = new URLSearchParams()
  if (params.page) s.set('page', String(params.page))
  if (params.limit) s.set('limit', String(params.limit))
  if (params.activitySlug) s.set('activitySlug', params.activitySlug)
  if (params.search) s.set('search', params.search)
  if (params.city) s.set('city', params.city)
  if (params.year) s.set('year', String(params.year))
  if (params.areaMin != null) s.set('areaMin', String(params.areaMin))
  if (params.areaMax != null) s.set('areaMax', String(params.areaMax))
  return s.toString()
}

export function parseAreaRange(area: string | undefined | null): { areaMin?: number; areaMax?: number } {
  if (!area) return {}
  const [a, b] = area.split('-')
  const min = a ? Number(a) : undefined
  const max = b ? Number(b) : undefined
  return {
    ...(Number.isFinite(min) ? { areaMin: min } : {}),
    ...(Number.isFinite(max) ? { areaMax: max } : {}),
  }
}

export function useProjects(params: ProjectQuery, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => (await api.get<Paginated<Project>>(`/projects?${qs(params)}`)).data,
    enabled: options?.enabled ?? true,
  })
}

export function useInfiniteProjects(
  params: Omit<ProjectQuery, 'page'> = {},
  startPage = 1,
) {
  return useInfiniteQuery({
    queryKey: ['projects-infinite', params, startPage],
    initialPageParam: startPage,
    queryFn: async ({ pageParam }) => {
      const res = await api.get<Paginated<Project>>(
        `/projects?${qs({ ...params, page: pageParam as number })}`,
      )
      return res.data
    },
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    enabled: false,
  })
}
