'use client'

import placeHolderImage from '@/assets/images/test_photo.png'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import ArrowsLeftIcon from '@/assets/icons/arrows_left.svg'
import { Tag } from '@/shared/Tag'
import { Separator } from '@/shared/Separator'
import { useExternalTarget } from '@/shared/hooks/useExternalTarget'

import type { IProjectCardData } from './toCardData'
export type { IProjectCardData } from './toCardData'

interface IProjectCardProps {
  data: IProjectCardData
  className?: string
  isHaveRightBorder?: boolean
  isOnBoundary?: boolean
  boundaryDirection?: 'left' | 'right'
  withoutTags?: boolean
  isShort?: boolean
}

const ProjectCard = ({
  data,
  className = '',
  isHaveRightBorder = false,
  isOnBoundary = false,
  boundaryDirection,
  withoutTags = false,
  isShort = false,
}: IProjectCardProps) => {
  const isExternalImage = typeof data.image === 'string'
  const image = data.image ?? placeHolderImage
  const target = useExternalTarget()

  return (
    <Link
      href={data.href}
      target={target}
      rel={target ? 'noopener noreferrer' : undefined}
      className={`${isShort ? 'w-[20.938rem] h-[25.625rem]' : 'w-[27.875rem] h-[28.5rem]'} max-md:w-full max-md:h-auto max-md:py-[1.5rem] shrink-0 relative cursor-pointer group py-[1.688rem] flex flex-col ${!isOnBoundary ? 'md:hover:bg-black-light' : ''} transition-colors duration-300 ${className}`}
    >
      {isOnBoundary && boundaryDirection === 'left' && (
        <div className='max-md:hidden w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 right-0' />
      )}
      {isOnBoundary && boundaryDirection === 'right' && (
        <div className='max-md:hidden w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-0' />
      )}
      <div className='hidden max-md:block w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-1/2 -translate-x-1/2 -z-10' />
      <div className='px-[2.188rem] flex flex-col flex-1 relative'>
        <p
          className={`text-[1.25rem] font-medium text-text-white ${isShort ? 'truncate' : ''}`}
        >
          {data.activity}
        </p>

        {isHaveRightBorder && (
          <Separator
            className={`max-md:hidden absolute right-0 -top-[1.625rem] ${isShort ? 'h-[25.5rem]' : 'h-[28.375rem]'}`}
            isVertical={true}
          />
        )}

        <div className='overflow-hidden mt-[1.875rem] relative h-[11.625rem] max-md:h-[16rem]'>
          {isExternalImage ? (
            <img
              src={image as string}
              className='w-full h-[11.625rem] max-md:h-[16rem] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]'
              alt={data.name}
            />
          ) : (
            <Image
              src={image as StaticImageData}
              className='w-full h-[11.625rem] max-md:h-[16rem] transition-transform duration-500 ease-out group-hover:scale-[1.06]'
              alt={data.name}
            />
          )}
          <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <span className='px-[1.125rem] py-[.5rem] border border-accent text-accent text-[.813rem] font-medium uppercase tracking-wider translate-y-[.625rem] group-hover:translate-y-0 transition-transform duration-300 ease-out'>
              Подробнее
            </span>
          </div>
        </div>

        <p className='text-[1.125rem] font-medium text-subtext mt-[1.875rem]'>{data.city}</p>

        <p
          className={`mt-[.625rem] ${isShort ? 'w-[14.375rem]' : 'w-[16.25rem]'} text-[1rem] font-medium text-text-white line-clamp-2`}
        >
          {data.name}
        </p>

        {!withoutTags && (
          <div className='flex gap-[.938rem] mt-auto pt-[1.188rem] flex-wrap'>
            {data.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>
        )}
      </div>

      <ArrowsLeftIcon
        className={`absolute ${isShort ? 'bottom-[2.188rem]' : 'bottom-[5.313rem]'} right-[2.188rem] w-[1.875rem] h-[1.25rem] [&>path]:stroke-accent transition-transform duration-300 ease-out group-hover:-translate-x-[.375rem]`}
      />
    </Link>
  )
}

export { ProjectCard }
