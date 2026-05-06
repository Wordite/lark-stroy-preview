import { notFound } from 'next/navigation'
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
  const { projectSlug } = await params
  const project = await fetchProjectBySlug(projectSlug)
  if (!project) notFound()

  return (
    <div>
      <ProjectHead project={project} />
      <ProjectDescription project={project} />
      <Contact isSimilarProject={true} isMarginTopDisabled={true} />
    </div>
  )
}
