import { serverFetch } from '../api'

export interface PagePublic {
  id: string
  slug: string
  title: string
  content: string
  published: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export function fetchPageBySlug(slug: string) {
  return serverFetch<PagePublic>(`/pages/slug/${slug}`)
}

export function fetchPages() {
  return serverFetch<PagePublic[]>('/pages')
}
