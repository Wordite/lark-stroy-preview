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
        className='w-[500px] mt-[55px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'
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
