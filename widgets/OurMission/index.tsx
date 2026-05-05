'use client'

import { Separator } from '@/shared/Separator'
import { MarqueeStrip } from '@/shared/MarqueeStrip'
import { StatBlock } from './ui/StatBlock'
import { useOurMissionAnimation } from './model/useOurMissionAnimation'
import ourMissionPlacaholderImage from '@/assets/images/our_mission_placeholder.png'
import ourMissonMaskImage from '@/assets/images/our_mission_mask.png'
import Image from 'next/image'

const marqueeItems = [
  'Проектирование', 'Строительство', 'Реконструкция', 'Капитальный ремонт',
  'Инженерные сети', 'Промышленные объекты', 'Жилые комплексы', 'Торговые центры',
  'Складские комплексы', 'Спортивные объекты', 'Образовательные учреждения',
]

const stats = [
  { value: 120, suffix: '+', label: 'объектов' },
  { value: 85, suffix: 'K м²', label: 'построено' },
  { value: 14, suffix: ' лет', label: 'на рынке' },
  { value: 50, suffix: '+', label: 'специалистов' },
]

const OurMission = () => {
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
    <section ref={sectionRef} className='min-h-screen max-h-screen overflow-y-clip flex flex-col'>
      <Separator isFullscreen={true} />

      <Image
        src={ourMissionPlacaholderImage}
        alt='bg'
        className='absolute left-0 w-screen h-screen -z-50 object-cover'
      />
      <Image
        src={ourMissonMaskImage}
        alt='bg mask'
        className='absolute left-0 w-screen h-screen -z-40 object-cover'
      />

      <h3
        ref={titleRef}
        className='w-[900px] pt-[97px] leading-[1.2em] text-[64px] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
      >
        Ларк Строй
      </h3>

      <p ref={subtitleRef} className='text-[18px] mt-[20px] font-medium text-subtext w-[435px]'>
        Строительная компания полного цикла в Республике Крым. Возводим современные объекты с 2010 года.
      </p>

      <div ref={missionBlockRef} className='h-[331px] mt-auto flex items-center relative'>
        <div className='w-screen border-t-[1px] border-light-gray-tranpsparent-40 h-[331px] backdrop-blur-[10px] -z-20 bg-black-transparent absolute top-0 -left-(--container-offset)' />

        <div className='w-[690px]'>
          <h3
            ref={missionTitleRef}
            className='font-semibold text-[36px] text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
          >
            Наша миссия
          </h3>

          <p ref={missionTextRef} className='w-[690px] mt-[20px]'>
            Мы создаём современные объекты, которые служат развитию Крыма. Каждый проект для нас - это возможность
            построить не просто здание, а пространство для бизнеса, работы и жизни
            <br /><br />
            За 14 лет работы мы ввели в эксплуатацию более 85 000 м² объектов различного назначения - от складских
            комплексов до современных общественных центров
          </p>
        </div>

        <Separator className='ml-[35px] translate-y-px' height='331px' isVertical={true} />

        <div ref={statsRef} className='ml-[60px] grid grid-cols-2 gap-y-[24px] gap-x-[74px]'>
          {stats.map((stat) => (
            <StatBlock key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    
      <MarqueeStrip items={marqueeItems} />
    </section>
  )
}

export { OurMission }
