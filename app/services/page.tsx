import type { Metadata } from 'next'
import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { Activities } from '@/widgets/Activities'
import { Contact } from '@/widgets/Contact'
import { fetchActivities } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects.server'
import { projectToCardData } from '@/entities/ProjectCard'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

export const metadata: Metadata = buildMeta({
  title: 'Услуги — направления деятельности',
  description:
    'Строительство складских комплексов, жилых домов, производственных и коммерческих объектов под ключ.',
  path: '/services',
})

export default async function ServicesPage() {
  const [activities, projectsPage] = await Promise.all([
    fetchActivities(),
    fetchProjects({ page: 1, limit: 8 }),
  ])

  const slides = (projectsPage?.items ?? []).map(projectToCardData)

  return (
    <div className='pt-[6.875rem]'>
      <h1 className='sr-only'>Направления деятельности — услуги строительства</h1>
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
