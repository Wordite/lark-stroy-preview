import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { Contact } from '@/widgets/Contact'
import { ProjectDescription } from '@/widgets/ProjectDescription'
import { ProjectHead } from '@/widgets/ProjectHead'
import { fetchProjectBySlug } from '@/services/entities/projects'

export const revalidate = 15

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
