import { Contact } from '@/widgets/Contact'
import { ProjectDescription } from '@/widgets/ProjectDescription'
import { ProjectHead } from '@/widgets/ProjectHead'

export default function ProjectPage() {
  return (
    <div>
      <ProjectHead />
      <ProjectDescription />
      <Contact isSimilarProject={true} isMarginTopDisabled={true} />
    </div>
  )
}
