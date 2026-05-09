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
      <Separator isFullscreen={true} className='mt-[17px] mb-[53px]' />
      <div className='flex justify-between items-center'>
        {items.map((item, i) => (
          <WhatWeBuildPoint
            key={`${item.text}-${i}`}
            Icon={StorageIcon}
            iconUrl={item.iconUrl ?? undefined}
            text={item.text}
          />
        ))}
      </div>
      <Separator isFullscreen={true} className='mt-[70px]' />
    </>
  )
}

export { WhatWeBuildPoints }
