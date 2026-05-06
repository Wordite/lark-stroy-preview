import { serverFetch } from '../api'
import type { ProjectCategory } from '../types'

export function fetchCategories() {
  return serverFetch<ProjectCategory[]>('/project-categories')
}

export function fetchCategoryBySlug(slug: string) {
  return serverFetch<ProjectCategory>(`/project-categories/slug/${slug}`)
}
