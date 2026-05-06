'use client'

import { Separator } from '@/shared/Separator'
import { useMarqueeAnimation } from './model/useMarqueeAnimation'

interface IMarqueeStripProps {
  items: string[]
  className?: string
}

const MarqueeStrip = ({ items, className }: IMarqueeStripProps) => {
  const { trackRef } = useMarqueeAnimation()

  const content = items.map((item, i) => (
    <p key={i} className='font-medium text-[1.125rem] text-text-black whitespace-nowrap'>{item}</p>
  ))

  return (
    <div className={`h-[2.375rem] relative bg-accent w-screen -translate-x-(--container-offset) ${className ?? ''}`}>
      <Separator className='absolute top-0 z-50 translate-x-0 -translate-y-px' isFullscreen={true} />
      <Separator className='absolute bottom-0 z-50 translate-x-0 translate-y-px' isFullscreen={true} />

      <div ref={trackRef} className='flex items-center h-full gap-[4.313rem] w-max'>
        <div className='flex items-center gap-[4.313rem] shrink-0'>
          {content}
        </div>
        <div className='flex items-center gap-[4.313rem] shrink-0'>
          {content}
        </div>
      </div>
    </div>
  )
}

export { MarqueeStrip }
