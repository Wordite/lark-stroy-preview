import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/services/seo'
import { fetchActivities } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects.server'
import { fetchNews } from '@/services/entities/news'
import { fetchPages } from '@/services/entities/pages'

export const revalidate = 60

async function fetchAllProjects() {
  const first = await fetchProjects({ page: 1, limit: 100 })
  if (!first) return []
  const all = [...first.items]
  const totalPages = first.pagination.totalPages
  for (let p = 2; p <= totalPages; p++) {
    const next = await fetchProjects({ page: p, limit: 100 })
    if (next?.items) all.push(...next.items)
  }
  return all
}

async function fetchAllNews() {
  const first = await fetchNews(1, 100)
  if (!first) return []
  const all = [...first.items]
  const totalPages = first.pagination.totalPages
  for (let p = 2; p <= totalPages; p++) {
    const next = await fetchNews(p, 100)
    if (next?.items) all.push(...next.items)
  }
  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
    { url: `${base}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const [activities, projects, news, pages] = await Promise.all([
    fetchActivities().catch(() => []),
    fetchAllProjects().catch(() => []),
    fetchAllNews().catch(() => []),
    fetchPages().catch(() => []),
  ])

  const activityRoutes: MetadataRoute.Sitemap = (activities ?? []).flatMap((a) => [
    { url: `${base}/services/${a.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/projects/${a.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ])

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((p) => ({
    url: `${base}/projects/${p.activity.slug}/${p.slug}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const newsRoutes: MetadataRoute.Sitemap = (news ?? []).map((n) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: n.publishedAt ? new Date(n.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const pageRoutes: MetadataRoute.Sitemap = (pages ?? []).map((p) => ({
    url: `${base}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.4,
  }))

  return [...staticRoutes, ...activityRoutes, ...projectRoutes, ...newsRoutes, ...pageRoutes]
}
