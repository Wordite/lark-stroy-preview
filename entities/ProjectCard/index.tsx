import placeHolderImage from '@/assets/images/test_photo.png'
import Image, { type StaticImageData } from 'next/image'
import ArrowsLeftIcon from '@/assets/icons/arrows_left.svg'
import { Tag } from '@/shared/Tag'
import { Separator } from '@/shared/Separator'

export interface IProjectCardData {
  id: string
  category: string
  city: string
  name: string
  tags: string[]
  image?: StaticImageData
  href: string
}

interface IProjectCardProps {
  data?: IProjectCardData
  className?: string
  isHaveRightBorder?: boolean
  isOnBoundary?: boolean
  boundaryDirection?: 'left' | 'right'
  withoutTags?: boolean
  isShort?: boolean
}

const DEFAULT_PROJECT: IProjectCardData = {
  id: 'project-default',
  category: 'Складской комплекс',
  city: 'Евпатория',
  name: 'Складское помещение «Бураш»',
  tags: ['1 200 м²', 'Симферополь', '2023'],
  href: '/projects/default',
}

const ProjectCard = ({
  data = DEFAULT_PROJECT,
  className = '',
  isHaveRightBorder = false,
  isOnBoundary = false,
  boundaryDirection,
  withoutTags = false,
  isShort = false,
}: IProjectCardProps) => {
  const image = data.image ?? placeHolderImage

  return (
    <figure
      className={`${isShort ? 'w-[335px] h-[410px]' : 'w-[446px] h-[456px]'} shrink-0 relative cursor-pointer group py-[27px] flex flex-col ${!isOnBoundary ? 'hover:bg-black-light' : ''} transition-colors duration-300 ${className}`}
    >
      {isOnBoundary && boundaryDirection === 'left' && (
        <div className='w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 right-0' />
      )}
      {isOnBoundary && boundaryDirection === 'right' && (
        <div className='w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-0' />
      )}
      <div className='px-[35px] flex flex-col flex-1 relative'>
        <p
          className={`text-[20px] font-medium text-text-white ${isShort ? 'truncate' : ''}`}
        >
          {data.category}
        </p>

        {isHaveRightBorder && (
          <Separator
            className={`absolute right-0 -top-[26px] ${isShort ? 'h-[408px]' : 'h-[454px]'}`}
            isVertical={true}
          />
        )}

        <div className='overflow-hidden mt-[30px] relative'>
          <Image
            src={image}
            className='w-full h-[186px] transition-transform duration-500 ease-out group-hover:scale-[1.06]'
            alt={data.name}
          />
          <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
            <span className='px-[18px] py-[8px] border border-accent text-accent text-[13px] font-medium uppercase tracking-wider translate-y-[10px] group-hover:translate-y-0 transition-transform duration-300 ease-out'>
              Подробнее
            </span>
          </div>
        </div>

        <p className='text-[18px] font-medium text-subtext mt-[30px]'>{data.city}</p>

        <p
          className={`mt-[10px] ${isShort ? 'w-[230px]' : 'w-[260px]'} text-[16px] font-medium text-text-white line-clamp-2`}
        >
          {data.name}
        </p>

        {!withoutTags && (
          <div className='flex gap-[15px] mt-auto pt-[19px] flex-wrap'>
            {data.tags.map((t) => (
              <Tag key={t} text={t} />
            ))}
          </div>
        )}
      </div>

      <ArrowsLeftIcon
        className={`absolute ${isShort ? 'bottom-[35px]' : 'bottom-[85px]'} right-[35px] w-[30px] h-[20px] [&>path]:stroke-accent transition-transform duration-300 group-hover:-translate-x-[6px]`}
      />
    </figure>
  )
}

export { ProjectCard }
