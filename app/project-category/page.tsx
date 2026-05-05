import { CategoryHead } from '@/widgets/CategoryHead'
import { CategoryProjects } from '@/widgets/CategoryProjects'
import { Contact } from '@/widgets/Contact'
import { ProjectsPagination } from '@/widgets/ProjectsPagination'

export default function ProjectCategoryPage() {
  return (
    <div>
      <CategoryHead className='mt-[170px]' />
      <CategoryProjects />
      <ProjectsPagination />
      <Contact isBorderTopDisabled={true} isSimilarProject={true} />
    </div>
  )
}
