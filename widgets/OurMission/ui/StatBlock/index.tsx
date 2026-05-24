'use client'

interface IStatBlockProps {
  value: string
  label: string
}

const StatBlock = ({ value, label }: IStatBlockProps) => {
  return (
    <div className=''>
      <p className='text-accent font-semibold text-[4rem] max-md:text-[2.25rem] leading-[1em]'>{value}</p>
      <p className='text-[1.125rem] mt-[.313rem] uppercase text-[var(--color-on-dark-muted)] leading-[1em]'>{label}</p>
    </div>
  )
}

export { StatBlock }
