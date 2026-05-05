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
      className={`w-[446px] h-[456px] shrink-0 relative cursor-pointer group py-[27px] ${!isOnBoundary ? 'hover:bg-black-light' : ''} transition-colors duration-300 ${className}`}
    >
      {isOnBoundary && boundaryDirection === 'left' && (
        <div className='w-screen group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 right-0' />
      )}
      {isOnBoundary && boundaryDirection === 'right' && (
        <div className='w-screen group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-0' />
      )}
      <div className='px-[35px] relative'>
        <p className='text-[20px] font-medium text-text-white'>{data.title}</p>

        {isHaveRightBorder && <Separator className='absolute right-0 -top-[26px] h-[454px]' isVertical={true} />}

        <div className='overflow-hidden mt-[30px]'>
          <Image
            src={image}
            className='w-full h-[186px] transition-transform duration-500 ease-out group-hover:scale-[1.04]'
            alt='news image'
          />
        </div>

        <p className='text-[15px] font-medium text-subtext mt-[31px]'>{data.description}</p>

        <Button style={STYLES.STROKE} className='w-full mt-[28px]'>
          {data.buttonLabel}
        </Button>
      </div>
    </figure>
  )
}

export { NewsCard }
