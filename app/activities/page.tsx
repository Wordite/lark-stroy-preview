import { LongerProjectSlider } from '@/features/LongerProjectSlider'
import { Activities } from '@/widgets/Activities'
import { Contact } from '@/widgets/Contact'
import { PROJECT_SLIDES } from '@/widgets/WhatWeBuild/model/projectSlides'

export default function ActivitiesPage() {
  return (
    <div className='pt-[110px]'>
      <Activities />

      <LongerProjectSlider
        title={
          <h4 className='w-[300px] mt-[70px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            Последние проекты
          </h4>
        }
        slides={PROJECT_SLIDES}
      />

      <Contact isUnderLongerSlider={true} />
    </div>
  )
}
