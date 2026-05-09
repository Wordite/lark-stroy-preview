import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { Activities } from '@/widgets/Activities'
import { Contact } from '@/widgets/Contact'
import { fetchActivities } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects'
import { projectToCardData } from '@/entities/ProjectCard'

export const revalidate = 15

export default async function ServicesPage() {
  const [activities, projectsPage] = await Promise.all([
    fetchActivities(),
    fetchProjects({ page: 1, limit: 8 }),
  ])

  const slides = (projectsPage?.items ?? []).map(projectToCardData)

  return (
    <div className='pt-[6.875rem]'>
      <Activities activities={activities ?? []} />

      <LongerProjectSlider
        title={
          <h4 className='w-[18.75rem] mt-[4.375rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Последние проекты
          </h4>
        }
        slides={slides}
      />

      <Contact isUnderLongerSlider={true} />
    </div>
  )
}
