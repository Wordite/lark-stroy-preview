import type { Metadata } from 'next'
import { Contact } from '@/widgets/Contact'
import { Activity } from '@/widgets/Activity'
import { CategoryProjects } from '@/widgets/CategoryProjects'
import { ProjectsHead } from '@/widgets/ProjectsHead'
import { AllProjectsPagination } from '@/features/AllProjectsPagination'
import { Separator } from '@/shared/Separator'
import { EmptyState } from '@/shared/EmptyState'
import { fetchActivities } from '@/services/entities/activities'
import { fetchContacts } from '@/services/entities/contacts'
import { fetchProjects, parseAreaRange } from '@/services/entities/projects.server'
import { buildMeta } from '@/services/seo'

export const metadata: Metadata = buildMeta({
  title: 'Проекты',
  description: 'Реализованные объекты: склады, жилые комплексы, производственные и торговые здания.',
  path: '/projects',
})

interface AreaBucket { min: number; max: number | null; label: string }
function parseAreaBuckets(json: string | undefined): AreaBucket[] {
  if (!json) return []
  try {
    const arr = JSON.parse(json)
    if (!Array.isArray(arr)) return []
    return arr.map((b: any) => ({
      min: Number(b.min) || 0,
      max: b.max == null || b.max === '' ? null : Number(b.max),
      label: String(b.label ?? ''),
    })).filter((b) => b.label.trim())
  } catch { return [] }
}

export const revalidate = 15

const PAGE_SIZE = 6
const PER_CATEGORY = 3

export default async function ProjectsPage(props: {
  searchParams: Promise<{ year?: string; type?: string; city?: string; area?: string; page?: string }>
}) {
  const sp = await props.searchParams
  const year = sp.year ? Number(sp.year) : undefined
  const filterCity = sp.city
  const filterTypeSlug = sp.type
  const filterArea = sp.area
  const { areaMin, areaMax } = parseAreaRange(filterArea)
  const page = Math.max(1, Number(sp.page ?? '1'))
  const isFiltered = !!(year || filterCity || filterTypeSlug || filterArea)

  const categories = (await fetchActivities()) ?? []
  const contacts = await fetchContacts()
  const areaBuckets = parseAreaBuckets(contacts?.settings?.project_area_buckets)

  const allProjectsForCities = await fetchProjects({ page: 1, limit: 50 })
  const cities = Array.from(
    new Set(
      (allProjectsForCities?.items ?? [])
        .map((p) => p.city)
        .filter((c): c is string => Boolean(c)),
    ),
  ).sort()

  if (isFiltered) {
    const flat = await fetchProjects({
      page,
      limit: PAGE_SIZE,
      activitySlug: filterTypeSlug,
      city: filterCity,
      year,
      areaMin,
      areaMax,
    })
    const items = flat?.items ?? []
    const totalPages = flat?.pagination.totalPages ?? 1
    const filterType = filterTypeSlug ? categories.find((c) => c.slug === filterTypeSlug) : undefined

    return (
      <div>
        <ProjectsHead className="mt-[10.625rem]" categories={categories} cities={cities} areaBuckets={areaBuckets} />
        <CategoryProjects
          projects={items}
          totalPages={totalPages}
          initialPage={page}
          activitySlug={filterTypeSlug}
          pageSize={PAGE_SIZE}
        />
        <Contact
          isBorderTopDisabled={true}
          prefillObjectType={filterType?.slug}
          prefillMessage={
            filterType
              ? `Здравствуйте! Меня заинтересовало направление «${filterType.title}». Хотелось бы обсудить проект.`
              : undefined
          }
        />
      </div>
    )
  }

  const groups = await Promise.all(
    categories.map(async (c) => {
      const data = await fetchProjects({ activitySlug: c.slug, page, limit: PER_CATEGORY })
      let items = data?.items ?? []
      if (items.length === 0 && page > 1) {
        const fallback = await fetchProjects({ activitySlug: c.slug, page: 1, limit: PER_CATEGORY })
        items = fallback?.items ?? []
      }
      return { activity: c, projects: items, totalPages: data?.pagination.totalPages ?? 1 }
    }),
  )
  const visible = groups.filter((g) => g.projects.length > 0)
  const totalPages = Math.max(1, ...groups.map((g) => g.totalPages))

  return (
    <div>
      <ProjectsHead className="mt-[10.625rem]" categories={categories} cities={cities} areaBuckets={areaBuckets} />
      {visible.length === 0 ? (
        <>
          <Separator isFullscreen={true} className='relative z-[1000]' />
          <EmptyState message='Проекты пока не добавлены.' />
          <Separator isFullscreen={true} className='relative z-[1000]' />
        </>
      ) : (
        <>
          <Separator isFullscreen={true} className='relative z-[1000]' />
          {visible.map((g) => (
            <Activity
              key={g.activity.id}
              activity={g.activity}
              projects={g.projects}
            />
          ))}
        </>
      )}
      <AllProjectsPagination totalPages={totalPages} />
      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
