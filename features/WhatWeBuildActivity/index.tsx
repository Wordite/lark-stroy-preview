import { WhatWeBuildPoint } from '@/entities/WhatWeBuildPoint'
import StorageIcon from '@/assets/icons/storage.svg'
import { Separator } from '@/shared/Separator'

interface IWhatWeBuildActivityProps {}

const WhatWeBuildPoints = ({}: IWhatWeBuildActivityProps) => {
  return (
    <>
      <Separator isFullscreen={true} className='mt-[17px] mb-[53px]' />
      <div className='flex justify-between items-center'>
        <WhatWeBuildPoint Icon={StorageIcon} text='fdsgdrgdr' />
        <WhatWeBuildPoint Icon={StorageIcon} text='fdsgdrgdr' />
        <WhatWeBuildPoint Icon={StorageIcon} text='fdsgdrgdr' />
        <WhatWeBuildPoint Icon={StorageIcon} text='fdsgdrgdr' />
        <WhatWeBuildPoint Icon={StorageIcon} text='fdsgdrgdr' />
      </div>
      <Separator isFullscreen={true} className='mt-[70px]' />
    </>
  )
}

export { WhatWeBuildPoints }
