import placeHolderImage from '@/assets/images/test_photo.png'
import Image, { type StaticImageData } from 'next/image'
import { Button, STYLES } from '@/shared/Button'
import { Separator } from '@/shared/Separator'

export interface INewsCardData {
  id: string
  title: string
  description: string
  buttonLabel: string
  image?: StaticImageData
  href: string
}

interface INewsCardProps {
  data?: INewsCardData
  className?: string
  isHaveRightBorder?: boolean
  isOnBoundary?: boolean
  boundaryDirection?: 'left' | 'right'
}

const DEFAULT_NEWS: INewsCardData = {
  id: 'news-default',
  title: 'Сделано в этом году',
  description: 'В 2024 году ввели в эксплуатацию более 25 000 м²',
  buttonLabel: 'Читать',
  href: '/news',
}

const NewsCard = ({
  data = DEFAULT_NEWS,
  className = '',
  isHaveRightBorder = false,
  isOnBoundary = false,
  boundaryDirection,
}: INewsCardProps) => {
  const image = data.image ?? placeHolderImage

  return (
    <figure
      className={`w-[27.875rem] h-[28.5rem] shrink-0 relative cursor-pointer group py-[1.688rem] ${!isOnBoundary ? 'hover:bg-black-light' : ''} transition-colors duration-300 ${className}`}
    >
      {isOnBoundary && boundaryDirection === 'left' && (
        <div className='w-screen group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 right-0' />
      )}
      {isOnBoundary && boundaryDirection === 'right' && (
        <div className='w-screen group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-0' />
      )}
      <div className='px-[2.188rem] relative'>
        <p className='text-[1.25rem] font-medium text-text-white'>{data.title}</p>

        {isHaveRightBorder && <Separator className='absolute right-0 -top-[1.625rem] h-[28.375rem]' isVertical={true} />}

        <div className='overflow-hidden mt-[1.875rem]'>
          <Image
            src={image}
            className='w-full h-[11.625rem] transition-transform duration-500 ease-out group-hover:scale-[1.04]'
            alt='news image'
          />
        </div>

        <p className='text-[.938rem] font-medium text-subtext mt-[1.938rem]'>{data.description}</p>

        <Button style={STYLES.STROKE} className='w-full mt-[1.75rem]'>
          {data.buttonLabel}
        </Button>
      </div>
    </figure>
  )
}

export { NewsCard }
