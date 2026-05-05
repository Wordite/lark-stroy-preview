'use client'

import { ActivityTab, type IActivityData } from '@/entities/ActivityTab'
import { Separator } from '@/shared/Separator'
import StorageIcon from '@/assets/icons/storage.svg'
import LivingIcon from '@/assets/icons/living.svg'
import ManufactureIcon from '@/assets/icons/manufacture.svg'
import CommercialIcon from '@/assets/icons/commercial.svg'
import { useActivitiesAnimation } from '@/widgets/Activities/model/useActivitiesAnimation'

const ACTIVITIES: IActivityData[] = [
  {
    id: 'storage',
    href: '/services/storage',
    title: 'Складские комплексы',
    Icon: StorageIcon,
    iconClass: 'w-[26px] h-[22px]',
    color: 'rgba(243, 188, 24, 1)',
    description:
      'Проектирование и строительство складов класса А и В. Современные логистические центры с автоматизированными системами управления',
    bullets: [
      'Стеллажные системы любой сложности',
      'Погрузочные доковые комплексы',
      'Системы пожаротушения',
      'Температурный контроль',
      'Административно-бытовые блоки',
    ],
  },
  {
    id: 'living',
    href: '/services/living',
    title: 'Жилые комплексы',
    Icon: LivingIcon,
    iconClass: 'w-[26px] h-[26px]',
    color: 'rgba(122, 226, 174, 1)',
    description:
      'Многоквартирные жилые дома и коттеджные посёлки под ключ. Современные архитектурные решения и качественные материалы',
    bullets: [
      'Многоэтажная застройка',
      'Малоэтажные комплексы',
      'Благоустройство территории',
      'Подземные паркинги',
      'Внутренняя отделка',
    ],
  },
  {
    id: 'manufacture',
    href: '/services/manufacture',
    title: 'Производственные объекты',
    Icon: ManufactureIcon,
    iconClass: 'w-[26px] h-[24px]',
    color: 'rgba(116, 185, 255, 1)',
    description:
      'Цеха, заводы и промышленные комплексы любой сложности. Энергоэффективные решения и современное инженерное оборудование',
    bullets: [
      'Промышленные цеха',
      'Производственные линии',
      'Инженерные коммуникации',
      'Очистные сооружения',
      'Складские пристройки',
    ],
  },
  {
    id: 'commercial',
    href: '/services/commercial',
    title: 'Коммерческая недвижимость',
    Icon: CommercialIcon,
    iconClass: 'w-[31px] h-[27px]',
    color: 'rgba(255, 142, 178, 1)',
    description:
      'Торговые центры, бизнес-центры и многофункциональные объекты. Комплексные решения для развития бизнеса',
    bullets: [
      'Торговые центры',
      'Бизнес-центры',
      'Гостиничные комплексы',
      'Рестораны и кафе',
      'Офисные пространства',
    ],
  },
]

const ActivitiesGrid = () => {
  const { gridRef } = useActivitiesAnimation()

  return (
    <>
      <Separator className='mt-[40px]' isFullscreen={true} />
      <div ref={gridRef} className='grid grid-cols-2 relative'>
        <ActivityTab data={ACTIVITIES[0]} isHaveRightBorder={true} boundaryDirection='left' />
        <ActivityTab data={ACTIVITIES[1]} isHaveLeftOffset={true} boundaryDirection='right' />
        <Separator className='absolute top-1/2 -translate-y-1/2' isFullscreen={true} />
        <ActivityTab data={ACTIVITIES[2]} isHaveRightBorder={true} boundaryDirection='left' />
        <ActivityTab data={ACTIVITIES[3]} isHaveLeftOffset={true} boundaryDirection='right' />
      </div>
      <Separator className='' isFullscreen={true} />
    </>
  )
}

export { ActivitiesGrid }
