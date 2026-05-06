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
      <p ref={valueRef} className='text-accent font-semibold text-[4rem] leading-[1em]'>0{suffix}</p>
      <p className='text-[1.125rem] mt-[.313rem] uppercase text-subtext leading-[1em]'>{label}</p>
    </div>
  )
}

export { StatBlock }
