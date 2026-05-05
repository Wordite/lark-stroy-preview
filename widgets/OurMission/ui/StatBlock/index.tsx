'use client'

import { useCounterAnimation } from './model/useCounterAnimation'

interface IStatBlockProps {
  value: number
  suffix?: string
  label: string
}

const StatBlock = ({ value, suffix = '+', label }: IStatBlockProps) => {
  const { valueRef } = useCounterAnimation(value, suffix)

  return (
    <div className=''>
      <p ref={valueRef} className='text-accent font-semibold text-[64px] leading-[1em]'>0{suffix}</p>
      <p className='text-[18px] mt-[5px] uppercase text-subtext leading-[1em]'>{label}</p>
    </div>
  )
}

export { StatBlock }
