import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { Contact } from '@/widgets/Contact'
import { ProjectDescription } from '@/widgets/ProjectDescription'
import { ProjectHead } from '@/widgets/ProjectHead'
import { fetchProjectBySlug } from '@/services/entities/projects.server'
import { mediaUrl } from '@/services/mediaUrl'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>
}): Promise<Metadata> {
  const { categorySlug, projectSlug } = await params
  const project = await fetchProjectBySlug(projectSlug).catch(() => null)
  if (!project) return {}
  return buildMeta({
    title: project.title,
    description: project.shortDescription || project.description,
    path: `/projects/${categorySlug}/${projectSlug}`,
    image: mediaUrl(project.mainImage) || undefined,
    type: 'article',
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ categorySlug: string; projectSlug: string }>
}) {
  const { categorySlug, projectSlug } = await params
  const project = await fetchProjectBySlug(projectSlug)
  if (!project) notFound()

  const h = await headers()
  const host = h.get('host') ?? ''
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const projectUrl = `${proto}://${host}/projects/${categorySlug}/${projectSlug}`
  const prefillMessage =
    `Здравствуйте! Меня заинтересовал проект «${project.title}» — ${projectUrl}. ` +
    `Хотелось бы обсудить похожий проект.`

  return (
    <div>
      <ProjectHead project={project} />
      <ProjectDescription project={project} />
      <Contact isSimilarProject={true} isMarginTopDisabled={true} prefillMessage={prefillMessage} />
    </div>
  )
}
