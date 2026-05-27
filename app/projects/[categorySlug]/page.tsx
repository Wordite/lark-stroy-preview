import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CategoryHead } from '@/widgets/CategoryHead'
import { CategoryProjects } from '@/widgets/CategoryProjects'
import { Contact } from '@/widgets/Contact'
import { fetchActivityBySlug } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects.server'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}): Promise<Metadata> {
  const { categorySlug } = await params
  const activity = await fetchActivityBySlug(categorySlug).catch(() => null)
  if (!activity) return {}
  return buildMeta({
    title: `Проекты — ${activity.title}`,
    description: activity.description,
    path: `/projects/${activity.slug}`,
  })
}

export default async function ActivityPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>
  searchParams: Promise<{ page?: string; year?: string; city?: string }>
}) {
  const { categorySlug: activitySlug } = await params
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? '1'))
  const activity = await fetchActivityBySlug(activitySlug)
  if (!activity) notFound()

  const projects = await fetchProjects({
    activitySlug,
    page,
    limit: 6,
    year: sp.year ? Number(sp.year) : undefined,
    city: sp.city || undefined,
  })
  const items = projects?.items ?? []
  const totalPages = projects?.pagination.totalPages ?? 1
  const cities = Array.from(
    new Set(items.map((p) => p.city).filter((c): c is string => Boolean(c))),
  ).sort()

  return (
    <div>
      <CategoryHead className='mt-[170px] max-md:!mt-[7rem]' activity={activity} cities={cities} />
      <CategoryProjects
        projects={items}
        totalPages={totalPages}
        initialPage={page}
        activitySlug={activitySlug}
        pageSize={6}
      />
      <Contact
        isBorderTopDisabled={true}
        isSimilarProject={true}
        prefillMessage={`Здравствуйте! Меня заинтересовало направление «${activity.title}». Хотелось бы обсудить проект.`}
      />
    </div>
  )
}
