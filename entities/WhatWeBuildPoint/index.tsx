interface IWhatWeBuildProps {
  className?: string
  Icon: JSX.Element
  text: string
}

const WhatWeBuildPoint = ({ className = '', Icon, text }: IWhatWeBuildProps) => {
  return (
    <div className={`w-[230px] flex gap-[14px] items-center ${className}`}>
      <Icon className='min-w-[26px] min-h-[26px] max-w-[26px] max-h-[26px]  [&>path]:fill-accent' />
      <span className='text-[16px] font-medium text-subtext'>Стеллажные системы любой сложности</span>
    </div>
  )
}

export { WhatWeBuildPoint }
