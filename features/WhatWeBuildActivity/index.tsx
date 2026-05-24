import { WhatWeBuildPoint } from '@/entities/WhatWeBuildPoint'
import StorageIcon from '@/assets/icons/storage.svg'
import { Separator } from '@/shared/Separator'
import { mediaUrl } from '@/services/mediaUrl'
import type { ActivityWhatWeBuildPoint, Service } from '@/services/types'

interface IWhatWeBuildPointsProps {
  services?: Service[]
  points?: ActivityWhatWeBuildPoint[]
}

const FALLBACK_TEXTS = [
  'Стеллажные системы',
  'Погрузочные доки',
  'Системы пожаротушения',
  'Температурный контроль',
  'Бытовые блоки',
]

const WhatWeBuildPoints = ({ services = [], points = [] }: IWhatWeBuildPointsProps) => {
  const items: { text: string; iconUrl: string | null }[] = points.length
    ? points.slice(0, 5).map((p) => ({ text: p.text, iconUrl: mediaUrl(p.iconUrl) ?? null }))
    : services.length
      ? services.slice(0, 5).map((s) => ({ text: s.title, iconUrl: null }))
      : FALLBACK_TEXTS.map((t) => ({ text: t, iconUrl: null }))

  return (
    <>
      <Separator isFullscreen={true} className='mt-[1.063rem] mb-[3.313rem]' />
      <div className='flex justify-between items-center gap-[1.5rem] max-md:flex-col max-md:items-start max-md:gap-[1.75rem]'>
        {items.map((item, i) => (
          <WhatWeBuildPoint
            key={`${item.text}-${i}`}
            Icon={StorageIcon}
            iconUrl={item.iconUrl ?? undefined}
            text={item.text}
          />
        ))}
      </div>
      <Separator isFullscreen={true} className='mt-[4.375rem]' />
    </>
  )
}

export { WhatWeBuildPoints }
