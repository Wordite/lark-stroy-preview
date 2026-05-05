import { Hero } from '@/widgets/Hero'
import { Map } from '@/widgets/Map'
import { OurMission } from '@/widgets/OurMission'
import { Activities } from '@/widgets/Activities'
import { WhatWeBuild } from '@/widgets/WhatWeBuild'
import { BeforeAfter } from '@/widgets/BeforeAfter'
import { Realization } from '@/widgets/Realization'
import { Contact } from '@/widgets/Contact'

export default function Home() {
  return (
    <div>
      <Hero />
      <OurMission />
      <Map />
      <Activities />
      <WhatWeBuild />
      <BeforeAfter />
      <Realization />
      <Contact />
    </div>
  )
}
