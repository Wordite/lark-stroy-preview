import { notFound } from 'next/navigation'
import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { RealizationRoad } from '@/features/RealizationRoad'
import { ActivityHead } from '@/widgets/ActivityHead'
import { Contact } from '@/widgets/Contact'
import { WhatWeBuildActivity } from '@/widgets/WhatWeBuildActivity'
import { fetchActivityPage } from '@/services/entities/activities'
import { projectToCardData } from '@/entities/ProjectCard'

export const revalidate = 15

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await fetchActivityPage(slug)
  if (!page) notFound()

  const slides = (page.sliderProjects ?? []).map(projectToCardData)

  return (
    <div>
      <ActivityHead activity={page} />
      <WhatWeBuildActivity services={page.services} points={page.whatWeBuildPoints} />
      <RealizationRoad isBorderTopDisabled={true} steps={page.realizationSteps} />
      <LongerProjectSlider
        title={
          <h4 className='w-[18.75rem] mt-[4.375rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Реализованные
            проекты
          </h4>
        }
        slides={slides}
      />
      <Contact isUnderLongerSlider={true} />
    </div>
  )
}
