import { serverFetch } from '../api'
import type { News, Paginated } from '../types'

export function fetchNews(page = 1, limit = 12) {
  return serverFetch<Paginated<News>>(`/news?page=${page}&limit=${limit}`)
}

export function fetchNewsBySlug(slug: string) {
  return serverFetch<News>(`/news/slug/${slug}`)
}
