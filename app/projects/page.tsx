import { Contact } from '@/widgets/Contact'
import { Activity } from '@/widgets/Activity'
import { CategoryProjects } from '@/widgets/CategoryProjects'
import { ProjectsHead } from '@/widgets/ProjectsHead'
import { fetchActivities } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects'

export const revalidate = 15

const PAGE_SIZE = 6

export default async function ProjectsPage(props: {
  searchParams: Promise<{ year?: string; type?: string; city?: string; page?: string }>
}) {
  const sp = await props.searchParams
  const year = sp.year ? Number(sp.year) : undefined
  const filterCity = sp.city
  const filterTypeSlug = sp.type
  const page = Math.max(1, Number(sp.page ?? '1'))
  const isFiltered = !!(year || filterCity || filterTypeSlug)

  const categories = (await fetchActivities()) ?? []

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
    })
    const items = flat?.items ?? []
    const totalPages = flat?.pagination.totalPages ?? 1

    return (
      <div>
        <ProjectsHead className='mt-[10.625rem]' categories={categories} cities={cities} />
        <CategoryProjects
          projects={items}
          totalPages={totalPages}
          initialPage={page}
          activitySlug={filterTypeSlug}
          pageSize={PAGE_SIZE}
        />
        <Contact isBorderTopDisabled={true} />
      </div>
    )
  }

  const groups = await Promise.all(
    categories.map(async (c) => {
      const data = await fetchProjects({ activitySlug: c.slug, page: 1, limit: 3 })
      return { activity: c, projects: data?.items ?? [] }
    }),
  )
  const visible = groups.filter((g) => g.projects.length > 0)

  return (
    <div>
      <ProjectsHead className='mt-[10.625rem]' categories={categories} cities={cities} />
      {visible.length === 0 ? (
        <p className='mt-[2.5rem] text-subtext text-[1.125rem]'>Проекты пока не добавлены.</p>
      ) : (
        visible.map((g) => (
          <Activity
            key={g.activity.id}
            activity={g.activity}
            projects={g.projects}
          />
        ))
      )}
      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
