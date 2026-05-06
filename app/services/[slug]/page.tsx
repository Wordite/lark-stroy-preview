import { notFound } from 'next/navigation'
import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { RealizationRoad } from '@/features/RealizationRoad'
import { ActivityHead } from '@/widgets/ActivityHead'
import { Contact } from '@/widgets/Contact'
import { PROJECT_SLIDES } from '@/widgets/WhatWeBuild/model/projectSlides'
import { WhatWeBuildActivity } from '@/widgets/WhatWeBuildActivity'
import { fetchActivityBySlug } from '@/services/entities/activities'

export const revalidate = 15

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const activity = await fetchActivityBySlug(slug)
  if (!activity) notFound()

  return (
    <div>
      <ActivityHead activity={activity} />
      <WhatWeBuildActivity services={activity.services} />
      <RealizationRoad isBorderTopDisabled={true} />
      <LongerProjectSlider
        title={
          <h4 className='w-[300px] mt-[70px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Реализованные
            проекты
          </h4>
        }
        slides={PROJECT_SLIDES}
      />
      <Contact isUnderLongerSlider={true} />
    </div>
  )
}
