import { WhatWeBuildPoint } from '@/entities/WhatWeBuildPoint'
import StorageIcon from '@/assets/icons/storage.svg'
import { Separator } from '@/shared/Separator'
import type { Service } from '@/services/types'

interface IWhatWeBuildPointsProps {
  services?: Service[]
}

const FALLBACK_TEXTS = [
  'Стеллажные системы',
  'Погрузочные доки',
  'Системы пожаротушения',
  'Температурный контроль',
  'Бытовые блоки',
]

const WhatWeBuildPoints = ({ services = [] }: IWhatWeBuildPointsProps) => {
  const items = services.length
    ? services.slice(0, 5).map((s) => s.title)
    : FALLBACK_TEXTS

  return (
    <>
      <Separator isFullscreen={true} className='mt-[17px] mb-[53px]' />
      <div className='flex justify-between items-center'>
        {items.map((text, i) => (
          <WhatWeBuildPoint key={`${text}-${i}`} Icon={StorageIcon} text={text} />
        ))}
      </div>
      <Separator isFullscreen={true} className='mt-[70px]' />
    </>
  )
}

export { WhatWeBuildPoints }
