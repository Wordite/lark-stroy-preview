'use client'

interface IStatBlockProps {
  value: string
  label: string
}

const StatBlock = ({ value, label }: IStatBlockProps) => {
  return (
    <div className=''>
      <p className='text-accent font-semibold text-[4rem] leading-[1em]'>{value}</p>
      <p className='text-[1.125rem] mt-[.313rem] uppercase text-subtext leading-[1em]'>{label}</p>
    </div>
  )
}

export { StatBlock }
