import type { ComponentType, SVGProps } from 'react'

interface IWhatWeBuildProps {
  className?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconUrl?: string | null
  text: string
}

const WhatWeBuildPoint = ({ className = '', Icon, iconUrl, text }: IWhatWeBuildProps) => {
  return (
    <div className={`w-[14.375rem] flex gap-[.875rem] items-center max-[81.25rem]:flex-col max-[81.25rem]:items-center max-[81.25rem]:text-center max-[81.25rem]:w-auto max-[81.25rem]:gap-[12px] max-md:flex-row max-md:items-center max-md:text-left max-md:w-auto max-md:gap-[17px] ${className}`}>
      {iconUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt='' className='min-w-[1.625rem] min-h-[1.625rem] max-w-[1.625rem] max-h-[1.625rem] max-md:min-w-[34px] max-md:min-h-[34px] max-md:max-w-[34px] max-md:max-h-[34px] object-contain' />
      ) : Icon ? (
        <Icon className='min-w-[1.625rem] min-h-[1.625rem] max-w-[1.625rem] max-h-[1.625rem] max-md:min-w-[34px] max-md:min-h-[34px] max-md:max-w-[34px] max-md:max-h-[34px] [&>path]:fill-accent' />
      ) : null}
      <span className='text-[1rem] max-md:text-[22px] font-medium text-subtext'>{text}</span>
    </div>
  )
}

export { WhatWeBuildPoint }
