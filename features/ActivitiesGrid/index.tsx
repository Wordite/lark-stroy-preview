'use client'

import { ActivityTab, type IActivityData } from '@/entities/ActivityTab'
import { Separator } from '@/shared/Separator'
import StorageIcon from '@/assets/icons/storage.svg'
import LivingIcon from '@/assets/icons/living.svg'
import ManufactureIcon from '@/assets/icons/manufacture.svg'
import CommercialIcon from '@/assets/icons/commercial.svg'
import { useActivitiesAnimation } from '@/widgets/Activities/model/useActivitiesAnimation'
import type { Activity } from '@/services/types'

const FALLBACK_COLORS = [
  'rgba(243, 188, 24, 1)',
  'rgba(122, 226, 174, 1)',
  'rgba(116, 185, 255, 1)',
  'rgba(255, 142, 178, 1)',
]

function mapActivities(items: Activity[]): IActivityData[] {
  return items.map((a, i) => ({
    id: a.slug,
    href: `/services/${a.slug}`,
    title: a.title,
    Icon: StorageIcon, // fallback icon; SVG is rendered via dangerouslySetInnerHTML in ActivityTab if iconSvg
    iconClass: 'w-[1.625rem] h-[1.625rem]',
    color: a.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
    description: a.description,
    bullets: a.services.slice(0, 5).map((s) => s.title),
    iconSvg: a.iconSvg ?? undefined,
  }))
}

const ACTIVITIES: IActivityData[] = [
  {
    id: 'storage',
    href: '/services/storage',
    title: 'Складские комплексы',
    Icon: StorageIcon,
    iconClass: 'w-[1.625rem] h-[1.375rem]',
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
    iconClass: 'w-[1.625rem] h-[1.625rem]',
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
    iconClass: 'w-[1.625rem] h-[1.5rem]',
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
    iconClass: 'w-[1.938rem] h-[1.688rem]',
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

interface ActivitiesGridProps {
  items?: Activity[]
}

const ActivitiesGrid = ({ items }: ActivitiesGridProps) => {
  const { gridRef } = useActivitiesAnimation()
  if (!items || items.length === 0) return null
  const data = mapActivities(items)
  const slots = data.slice(0, 4)

  return (
    <>
      <Separator className='mt-[2.5rem]' isFullscreen={true} />
      <div ref={gridRef}>
        {/* Mobile (<md): plain stacked list with a full-width Separator between
            every card. Desktop: 2x2 grid with vertical sep inside row + full-
            width sep between row 1 and row 2. */}

        {/* Mobile layout */}
        <div className='md:hidden flex flex-col'>
          {slots.map((s, i) => (
            <div key={`m-${s.id}`}>
              {i > 0 && <Separator isFullscreen={true} />}
              <ActivityTab data={s} />
            </div>
          ))}
        </div>

        {/* Desktop layout */}
        <div className='max-md:hidden'>
          <div className='grid grid-cols-2 relative'>
            {slots[0] && <ActivityTab data={slots[0]} isHaveRightBorder={true} boundaryDirection='left' />}
            {slots[1] && <ActivityTab data={slots[1]} isHaveLeftOffset={true} boundaryDirection='right' />}
          </div>
          {slots.length > 2 && <Separator isFullscreen={true} />}
          {(slots[2] || slots[3]) && (
            <div className='grid grid-cols-2 relative'>
              {slots[2] && <ActivityTab data={slots[2]} isHaveRightBorder={true} boundaryDirection='left' />}
              {slots[3] && <ActivityTab data={slots[3]} isHaveLeftOffset={true} boundaryDirection='right' />}
            </div>
          )}
        </div>
      </div>
      <Separator className='' isFullscreen={true} />
    </>
  )
}

export { ActivitiesGrid }
