'use client'

import Link from 'next/link'
import DiagonalArrowIcon from '@/assets/icons/arrow_diagonal.svg'
import type { IJourneyCity } from '../../model/journey'

interface IProjectCardProps {
  city: IJourneyCity
  className?: string
}

const ProjectCard = ({ city, className }: IProjectCardProps) => {
  return (
    <article
      className={`w-full rounded-[0.5rem] overflow-hidden border-[0.063rem] backdrop-blur-md ${className ?? ''}`}
      style={{
        borderColor: 'var(--journey-card-border)',
        backgroundColor: 'var(--journey-card-bg)',
        boxShadow: 'var(--journey-card-shadow)',
      }}
    >
      {city.image && (
        <div
          className='relative w-full h-[10rem] max-md:h-[12.5rem] overflow-hidden'
          style={{ backgroundColor: 'var(--journey-card-image-bg)' }}
        >
          <img src={city.image} alt={city.name} className='w-full h-full object-cover' />
        </div>
      )}
      <div className='flex flex-col p-[1.25rem] max-md:p-[1.5rem]'>
        <span className='text-[0.8125rem] max-md:text-[0.9375rem] font-semibold tracking-wide text-[#5b8def]'>{city.period}</span>
        <h4
          className='text-[1.375rem] max-md:text-[1.75rem] font-bold mt-[0.25rem]'
          style={{ color: 'var(--journey-card-title)' }}
        >
          {city.name}
        </h4>
        <p
          className='text-[0.9375rem] max-md:text-[1.0625rem] leading-[1.45] mt-[0.5rem]'
          style={{ color: 'var(--journey-card-muted)' }}
        >
          {city.description}
        </p>
        <Link
          href={city.href}
          className='group/btn mt-[1.125rem] inline-flex items-center gap-[0.5rem] text-[0.9375rem] max-md:text-[1.0625rem] font-semibold text-accent w-fit'
        >
          Смотреть проект
          <DiagonalArrowIcon className='w-[1rem] h-[1rem] max-md:w-[1.125rem] max-md:h-[1.125rem] [&_path]:fill-accent transition-transform duration-300 group-hover/btn:translate-x-[0.1875rem] group-hover/btn:-translate-y-[0.1875rem]' />
        </Link>
      </div>
    </article>
  )
}

export { ProjectCard }
