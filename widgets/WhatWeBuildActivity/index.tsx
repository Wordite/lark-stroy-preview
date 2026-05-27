'use client'

import { WhatWeBuildPoints } from '@/features/WhatWeBuildActivity'
import { useWhatWeBuildActivityAnimation } from './model/useWhatWeBuildActivityAnimation'
import type { ActivityWhatWeBuildPoint, Service } from '@/services/types'

interface IWhatWeBuildActivityProps {
  services?: Service[]
  points?: ActivityWhatWeBuildPoint[]
}

const WhatWeBuildActivity = ({ services, points }: IWhatWeBuildActivityProps) => {
  const { sectionRef, titleRef, pointsRef } = useWhatWeBuildActivityAnimation()

  return (
    <section ref={sectionRef}>
      <h4
        ref={titleRef}
        className='w-[31.25rem] max-md:w-full mt-[3.438rem] max-md:mt-[2.125rem] text-[2.25rem] max-md:text-[1.7rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
      >
        Что мы строим
      </h4>
      <div ref={pointsRef}>
        <WhatWeBuildPoints services={services} points={points} />
      </div>
    </section>
  )
}

export { WhatWeBuildActivity }
