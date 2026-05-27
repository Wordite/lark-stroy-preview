import { serverFetch } from '../serverFetch'
import type { MapPoint, Paginated, Project } from '../types'
import type { ProjectQuery } from './projects'

export { parseAreaRange } from './projects'
export type { ProjectQuery } from './projects'

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

export function fetchProjects(params: ProjectQuery = {}) {
  return serverFetch<Paginated<Project>>(`/projects?${qs(params)}`)
}

export function fetchProjectBySlug(slug: string) {
  return serverFetch<Project>(`/projects/slug/${slug}`)
}

export function fetchMapPoints() {
  return serverFetch<MapPoint[]>('/projects/map')
}
