import { Contact } from '@/widgets/Contact'
import { ProjectCategory } from '@/widgets/ProjectCategory'
import { ProjectsHead } from '@/widgets/ProjectsHead'
import { ProjectsPagination } from '@/widgets/ProjectsPagination'

export default function ProjectsPage() {
  return (
    <div>
      <ProjectsHead className='mt-[170px]' />
      <ProjectCategory className='mt-[40px]' />
      <ProjectCategory />
      <ProjectCategory />
      <ProjectCategory />
      <ProjectsPagination />
      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
