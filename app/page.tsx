import { Hero } from '@/widgets/Hero'
import { Map } from '@/widgets/Map'
import { OurMission } from '@/widgets/OurMission'
import { Activities } from '@/widgets/Activities'
import { WhatWeBuild } from '@/widgets/WhatWeBuild'
import { BeforeAfter } from '@/widgets/BeforeAfter'
import { Realization } from '@/widgets/Realization'
import { Contact } from '@/widgets/Contact'
import { fetchActivities } from '@/services/entities/activities'
import { fetchHomeContent } from '@/services/entities/home'
import { fetchMapPoints } from '@/services/entities/projects'

export const revalidate = 15

export default async function Home() {
  const [activities, home, mapPoints] = await Promise.all([
    fetchActivities(),
    fetchHomeContent(),
    fetchMapPoints(),
  ])

  return (
    <div>
      <Hero block={home?.hero} />
      <OurMission block={home?.our_mission} />
      <Map points={mapPoints ?? []} />
      <Activities activities={activities ?? []} />
      <WhatWeBuild block={home?.what_we_build} />
      <BeforeAfter block={home?.before_after} />
      <Realization block={home?.realization} roadBlock={home?.realization_road} />
      <Contact />
    </div>
  )
}
