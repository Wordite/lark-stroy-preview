'use client'

import { Separator } from '@/shared/Separator'
import { MarqueeStrip } from '@/shared/MarqueeStrip'
import { StatBlock } from './ui/StatBlock'
import { useOurMissionAnimation } from './model/useOurMissionAnimation'
import ourMissionPlacaholderImage from '@/assets/images/our_mission_placeholder.png'
import ourMissonMaskImage from '@/assets/images/our_mission_mask.png'
import Image from 'next/image'
import type { HomeBlockPublic } from '@/services/types'

interface OurMissionConfig {
  title?: string
  subtitle?: string
  missionTitle?: string
  missionText?: string
  metrics?: { value: string | number; suffix?: string; label?: string; mode?: string }[]
}

interface IOurMissionProps {
  block?: HomeBlockPublic | null
}

const marqueeItems = [
  'Проектирование', 'Строительство', 'Реконструкция', 'Капитальный ремонт',
  'Инженерные сети', 'Промышленные объекты', 'Жилые комплексы', 'Торговые центры',
  'Складские комплексы', 'Спортивные объекты', 'Образовательные учреждения',
]

const FALLBACK = {
  title: 'Ларк Строй',
  subtitle: 'Строительная компания полного цикла в Республике Крым. Возводим современные объекты с 2010 года.',
  missionTitle: 'Наша миссия',
  missionText:
    'Мы создаём современные объекты, которые служат развитию Крыма. Каждый проект для нас - это возможность построить не просто здание, а пространство для бизнеса, работы и жизни',
  metrics: [
    { value: '120+', label: 'объектов' },
    { value: '85K м²', label: 'построено' },
    { value: '14 лет', label: 'на рынке' },
    { value: '50+', label: 'специалистов' },
  ],
}

const OurMission = ({ block }: IOurMissionProps) => {
  const cfg = (block?.config ?? {}) as OurMissionConfig
  const title = block?.title || cfg.title || FALLBACK.title
  const subtitle = cfg.subtitle || FALLBACK.subtitle
  const missionTitle = cfg.missionTitle || FALLBACK.missionTitle
  const missionText = cfg.missionText || FALLBACK.missionText
  const stats = (cfg.metrics && cfg.metrics.length ? cfg.metrics : FALLBACK.metrics).map((m) => ({
    value: typeof m.value === 'number' ? `${m.value}${m.suffix ?? ''}` : (m.value ?? ''),
    label: m.label ?? '',
  }))

  const {
    sectionRef,
    titleRef,
    subtitleRef,
    missionBlockRef,
    missionTitleRef,
    missionTextRef,
    statsRef,
  } = useOurMissionAnimation()

  return (
    <section ref={sectionRef} className='min-h-screen max-h-screen overflow-y-clip flex flex-col max-md:min-h-0 max-md:max-h-none max-md:overflow-visible'>
      <Separator isFullscreen={true} onDark={true} />

      <Image
        src={ourMissionPlacaholderImage}
        alt='bg'
        className='absolute left-0 w-screen h-screen -z-50 object-cover'
      />
      <Image
        src={ourMissonMaskImage}
        alt='bg mask'
        className='absolute left-0 w-screen h-screen -z-40 object-cover max-md:hidden'
      />
      {/* На мобильных вместо картинки-маски — простое затемнение фоновой картинки */}
      <div className='hidden max-md:block absolute left-0 w-screen h-screen -z-[45] bg-[rgba(17,21,23,0.6)]' />

      <h3
        ref={titleRef}
        className='w-[56.25rem] max-md:w-full max-md:text-[2.25rem] pt-[6.063rem] max-md:pt-[3rem] leading-[1.2em] text-[4rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-on-dark)'
      >
        {title}
      </h3>

      <p ref={subtitleRef} className='text-[1.125rem] mt-[1.25rem] font-medium text-[var(--color-on-dark-muted)] w-[27.188rem] max-md:w-full'>
        {subtitle}
      </p>

      <div ref={missionBlockRef} className='h-[20.688rem] mt-auto flex items-center relative max-md:flex-col max-md:items-stretch max-md:h-auto max-md:mt-[3rem] max-md:py-[2rem] max-md:gap-[2rem]'>
        <div className='w-screen border-t-[.063rem] border-[rgba(197,199,202,0.4)] h-[20.688rem] backdrop-blur-[.625rem] -z-20 bg-[rgba(22,27,31,0.7)] absolute top-0 -left-(--container-offset) max-md:h-full' />

        <div className='w-[43.125rem] max-md:w-full'>
          <h3
            ref={missionTitleRef}
            className='font-semibold text-[2.25rem] max-md:text-[1.5rem] text-transparent bg-clip-text bg-(image:--color-gradient-on-dark)'
          >
            {missionTitle}
          </h3>

          <p ref={missionTextRef} className='w-[43.125rem] max-md:w-full mt-[1.25rem] whitespace-pre-line text-[var(--color-on-dark-muted)]'>
            {missionText}
          </p>
        </div>

        <Separator className='ml-[2.188rem] translate-y-px max-md:hidden' height='20.688rem' isVertical={true} onDark={true} />

        <div ref={statsRef} className='ml-[3.75rem] max-md:ml-0 grid grid-cols-2 gap-y-[1.5rem] gap-x-[4.625rem] max-md:gap-x-[1.5rem]'>
          {stats.map((stat, i) => (
            <StatBlock key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>

      <MarqueeStrip items={marqueeItems} />
    </section>
  )
}

export { OurMission }
