import type { Metadata } from 'next'
import { Hero } from '@/widgets/Hero'
import { Map } from '@/widgets/Map'
import { OurMission } from '@/widgets/OurMission'
import { Activities } from '@/widgets/Activities'
import { WhatWeBuild } from '@/widgets/WhatWeBuild'
import { BeforeAfter } from '@/widgets/BeforeAfter'
import { Realization } from '@/widgets/Realization'
import { Contact } from '@/widgets/Contact'
import { fetchActivities } from '@/services/entities/activities'
import { fetchContacts } from '@/services/entities/contacts'
import { fetchHomeContent } from '@/services/entities/home'
import { fetchMapPoints } from '@/services/entities/projects'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

export async function generateMetadata(): Promise<Metadata> {
  const contacts = await fetchContacts()
  const s = contacts?.settings ?? {}
  return buildMeta({
    title: s.site_title || 'Ларк Строй — строительство в Крыму',
    description:
      s.site_tagline ||
      'Проектирование и строительство складских, жилых, производственных и коммерческих объектов в Республике Крым.',
    path: '/',
  })
}

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
      <div className='md:-mt-[0.063rem]'>
        <Contact isBorderTopDisabled={true} />
      </div>
    </div>
  )
}
