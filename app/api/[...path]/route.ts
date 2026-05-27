import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const MOCKS_DIR = path.join(process.cwd(), 'mocks')

async function readJson(rel: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(path.join(MOCKS_DIR, rel), 'utf8')
    return JSON.parse(raw)
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

async function resolve(p: string, search: URLSearchParams) {
  if (p === '/activities') return readJson('activities.json')
  let m = p.match(/^\/activities\/page\/([^/]+)$/)
  if (m) return readJson(`activities-page/${m[1]}.json`)
  m = p.match(/^\/activities\/slug\/([^/]+)$/)
  if (m) return readJson(`activities-slug/${m[1]}.json`)
  m = p.match(/^\/services\/([^/]+)\/([^/]+)$/)
  if (m) return readJson(`services/${m[1]}/${m[2]}.json`)
  if (p === '/home-content') return readJson('home-content.json')
  if (p === '/contacts') return readJson('contacts.json')
  if (p === '/footer') return readJson('footer.json')
  if (p === '/pages') return readJson('pages.json')
  m = p.match(/^\/pages\/slug\/([^/]+)$/)
  if (m) return readJson(`pages-slug/${m[1]}.json`)
  if (p === '/projects/map') return readJson('projects-map.json')
  m = p.match(/^\/projects\/slug\/([^/]+)$/)
  if (m) return readJson(`projects-slug/${m[1]}.json`)
  if (p === '/projects') {
    const all = await readJson('projects-all.json')
    if (!all) return null
    let items = all.items as any[]
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
    return paginate(items, page, limit)
  }
  if (p === '/news') {
    const all = await readJson('news-all.json')
    if (!all) return null
    const page = Number(search.get('page') ?? '1')
    const limit = Number(search.get('limit') ?? '12')
    return paginate(all.items, page, limit)
  }
  m = p.match(/^\/news\/slug\/([^/]+)$/)
  if (m) return readJson(`news-slug/${m[1]}.json`)
  return null
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params
  const p = '/' + (segments || []).join('/')
  const data = await resolve(p, req.nextUrl.searchParams)
  if (data === null) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await ctx.params
  const p = '/' + (segments || []).join('/')
  if (p === '/leads') return NextResponse.json({ ok: true })
  return NextResponse.json({ ok: true })
}
