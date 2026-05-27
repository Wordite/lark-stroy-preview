import 'server-only'
import path from 'path'
import { promises as fs } from 'fs'

const MOCKS_DIR = path.join(process.cwd(), 'mocks')

async function readJson<T>(rel: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(path.join(MOCKS_DIR, rel), 'utf8')
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  return {
    items: items.slice(start, start + limit),
    pagination: { page, limit, total, totalPages },
  }
}

async function resolveMock<T>(rawPath: string): Promise<T | null> {
  const [p, q = ''] = rawPath.split('?')
  const search = new URLSearchParams(q)

  if (p === '/activities') return readJson<T>('activities.json')
  let m = p.match(/^\/activities\/page\/([^/]+)$/)
  if (m) return readJson<T>(`activities-page/${m[1]}.json`)
  m = p.match(/^\/activities\/slug\/([^/]+)$/)
  if (m) return readJson<T>(`activities-slug/${m[1]}.json`)
  m = p.match(/^\/services\/([^/]+)\/([^/]+)$/)
  if (m) return readJson<T>(`services/${m[1]}/${m[2]}.json`)
  if (p === '/home-content') return readJson<T>('home-content.json')
  if (p === '/contacts') return readJson<T>('contacts.json')
  if (p === '/footer') return readJson<T>('footer.json')
  if (p === '/pages') return readJson<T>('pages.json')
  m = p.match(/^\/pages\/slug\/([^/]+)$/)
  if (m) return readJson<T>(`pages-slug/${m[1]}.json`)
  if (p === '/projects/map') return readJson<T>('projects-map.json')
  m = p.match(/^\/projects\/slug\/([^/]+)$/)
  if (m) return readJson<T>(`projects-slug/${m[1]}.json`)
  if (p === '/projects') {
    const all = await readJson<{ items: any[] }>('projects-all.json')
    if (!all) return null
    let items = all.items
    const activitySlug = search.get('activitySlug')
    const city = search.get('city')
    const year = search.get('year')
    const sQ = search.get('search')?.toLowerCase()
    const areaMin = search.get('areaMin')
    const areaMax = search.get('areaMax')
    if (activitySlug) items = items.filter((x) => x.activity?.slug === activitySlug)
    if (city) items = items.filter((x) => x.city === city)
    if (year) items = items.filter((x) => x.completedAt?.startsWith(year))
    if (sQ) items = items.filter((x) => (x.title || '').toLowerCase().includes(sQ))
    if (areaMin) items = items.filter((x) => (x.area ?? 0) >= Number(areaMin))
    if (areaMax) items = items.filter((x) => (x.area ?? 0) <= Number(areaMax))
    const page = Number(search.get('page') ?? '1')
    const limit = Number(search.get('limit') ?? '24')
    return paginate(items, page, limit) as T
  }
  if (p === '/news') {
    const all = await readJson<{ items: any[] }>('news-all.json')
    if (!all) return null
    const page = Number(search.get('page') ?? '1')
    const limit = Number(search.get('limit') ?? '12')
    return paginate(all.items, page, limit) as T
  }
  m = p.match(/^\/news\/slug\/([^/]+)$/)
  if (m) return readJson<T>(`news-slug/${m[1]}.json`)

  return null
}

export async function serverFetch<T>(path: string, _init: RequestInit = {}): Promise<T | null> {
  try {
    const res = await resolveMock<T>(path)
    if (res === null) console.warn(`[mock] no data for ${path}`)
    return res
  } catch (err) {
    console.error('serverFetch (mock) error:', err)
    return null
  }
}
