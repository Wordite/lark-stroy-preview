'use client'

interface IStatBlockProps {
  value: string
  label: string
}

const StatBlock = ({ value, label }: IStatBlockProps) => {
  return (
    <div className=''>
      <p className='text-accent font-semibold whitespace-nowrap leading-[1em] text-[clamp(1.75rem,3.2vw,4rem)] max-md:text-[2.25rem]'>{value}</p>
      <p className='text-[1.125rem] max-md:text-[.875rem] mt-[.313rem] uppercase text-[var(--color-on-dark-muted)] leading-[1.2em]'>{label}</p>
    </div>
  )
}

export { StatBlock }
