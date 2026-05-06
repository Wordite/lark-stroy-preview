import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { api, serverFetch } from '../api'
import type { MapPoint, Paginated, Project } from '../types'

export interface ProjectQuery {
  page?: number
  limit?: number
  categorySlug?: string
  tagSlugs?: string[]
  search?: string
  city?: string
  year?: number
}

function qs(params: ProjectQuery) {
  const s = new URLSearchParams()
  if (params.page) s.set('page', String(params.page))
  if (params.limit) s.set('limit', String(params.limit))
  if (params.categorySlug) s.set('categorySlug', params.categorySlug)
  if (params.search) s.set('search', params.search)
  if (params.city) s.set('city', params.city)
  if (params.year) s.set('year', String(params.year))
  if (params.tagSlugs?.length) for (const t of params.tagSlugs) s.append('tagSlugs', t)
  return s.toString()
}

export function fetchProjects(params: ProjectQuery = {}) {
  return serverFetch<Paginated<Project>>(`/projects?${qs(params)}`)
}

export function fetchProjectBySlug(slug: string) {
  return serverFetch<Project>(`/projects/slug/${slug}`)
}

export function fetchMapPoints() {
  return serverFetch<MapPoint[]>('/projects/map')
}

export function useProjects(params: ProjectQuery) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => (await api.get<Paginated<Project>>(`/projects?${qs(params)}`)).data,
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
