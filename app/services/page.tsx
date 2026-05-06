import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { Activities } from '@/widgets/Activities'
import { Contact } from '@/widgets/Contact'
import { PROJECT_SLIDES } from '@/widgets/WhatWeBuild/model/projectSlides'
import { fetchActivities } from '@/services/entities/activities'
import { fetchProjects } from '@/services/entities/projects'

export const revalidate = 15

export default async function ServicesPage() {
  const [activities, projects] = await Promise.all([
    fetchActivities(),
    fetchProjects({ page: 1, limit: 8 }),
  ])

  // TODO(next-agent): map projects.items to LongerProjectSlider's slides shape (PROJECT_SLIDES type)
  return (
    <div className='pt-[6.875rem]'>
      <Activities activities={activities ?? []} />

      <LongerProjectSlider
        title={
          <h4 className='w-[18.75rem] mt-[4.375rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Последние проекты
          </h4>
        }
        slides={PROJECT_SLIDES}
      />

      <Contact isUnderLongerSlider={true} />
    </div>
  )
}
