import { notFound } from 'next/navigation'
import { CategoryHead } from '@/widgets/CategoryHead'
import { CategoryProjects } from '@/widgets/CategoryProjects'
import { Contact } from '@/widgets/Contact'
import { fetchCategoryBySlug } from '@/services/entities/categories'
import { fetchProjects } from '@/services/entities/projects'

export const revalidate = 15

export default async function ProjectCategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const { categorySlug } = await params
  const category = await fetchCategoryBySlug(categorySlug)
  if (!category) notFound()

  const projects = await fetchProjects({ categorySlug, page: 1, limit: 12 })
  const items = projects?.items ?? []
  const cities = Array.from(
    new Set(items.map((p) => p.city).filter((c): c is string => Boolean(c))),
  ).sort()

  return (
    <div>
      <CategoryHead className='mt-[170px]' category={category} cities={cities} />
      <CategoryProjects projects={items} categorySlug={categorySlug} pageSize={12} />
      <Contact isBorderTopDisabled={true} isSimilarProject={true} />
    </div>
  )
}
