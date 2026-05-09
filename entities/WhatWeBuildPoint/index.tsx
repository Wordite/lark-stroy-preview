import type { ComponentType, SVGProps } from 'react'

interface IWhatWeBuildProps {
  className?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconUrl?: string | null
  text: string
}

const WhatWeBuildPoint = ({ className = '', Icon, iconUrl, text }: IWhatWeBuildProps) => {
  return (
    <div className={`w-[230px] flex gap-[14px] items-center ${className}`}>
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt='' className='min-w-[26px] min-h-[26px] max-w-[26px] max-h-[26px] object-contain' />
      ) : Icon ? (
        <Icon className='min-w-[26px] min-h-[26px] max-w-[26px] max-h-[26px]  [&>path]:fill-accent' />
      ) : null}
      <span className='text-[16px] font-medium text-subtext'>{text}</span>
    </div>
  )
}

export { WhatWeBuildPoint }
