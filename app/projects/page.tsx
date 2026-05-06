import { Contact } from '@/widgets/Contact'
import { ProjectCategory } from '@/widgets/ProjectCategory'
import { ProjectsHead } from '@/widgets/ProjectsHead'
import { fetchCategories } from '@/services/entities/categories'
import { fetchProjects } from '@/services/entities/projects'

export const revalidate = 15

export default async function ProjectsPage(props: {
  searchParams: Promise<{ year?: string; type?: string; city?: string }>
}) {
  const sp = await props.searchParams
  const year = sp.year ? Number(sp.year) : undefined
  const filterCity = sp.city
  const filterTypeSlug = sp.type
  const isFiltered = !!(year || filterCity || filterTypeSlug)

  const categories = (await fetchCategories()) ?? []

  // For "city" select options we read the first 50 published projects and
  // collect distinct cities. Cheap, ISR-cached.
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
      page: 1,
      limit: 24,
      categorySlug: filterTypeSlug,
      city: filterCity,
      year,
    })
    const cat = filterTypeSlug ? categories.find((c) => c.slug === filterTypeSlug) : undefined
    const items = flat?.items ?? []

    return (
      <div>
        <ProjectsHead className='mt-[10.625rem]' categories={categories} cities={cities} />
        {items.length === 0 ? (
          <p className='mt-[2.5rem] text-subtext text-[1.125rem]'>По заданным фильтрам ничего не найдено.</p>
        ) : (
          <ProjectCategory
            className='mt-[2.5rem]'
            category={cat}
            projects={items.slice(0, 9)}
          />
        )}
        <Contact isBorderTopDisabled={true} />
      </div>
    )
  }

  const groups = await Promise.all(
    categories.map(async (c) => {
      const data = await fetchProjects({ categorySlug: c.slug, page: 1, limit: 3 })
      return { category: c, projects: data?.items ?? [] }
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
          <ProjectCategory
            key={g.category.id}
            className='mt-[2.5rem]'
            category={g.category}
            projects={g.projects}
          />
        ))
      )}
      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
