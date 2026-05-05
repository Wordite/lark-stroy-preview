'use client'

import testImage from '@/assets/images/test_photo.png'
import { BeforeAfterSlide, type IBeforeAfterSlideData } from '@/entities/BeforeAfterSlide'
import { Slider } from '@/features/Slider'
import { Separator } from '@/shared/Separator'

const VISIBLE_COUNT = 1

const SLIDES: IBeforeAfterSlideData[] = [
  { id: 'ba-1', beforeImage: testImage, afterImage: testImage },
  { id: 'ba-2', beforeImage: testImage, afterImage: testImage },
  { id: 'ba-3', beforeImage: testImage, afterImage: testImage },
]

const BeforeAfter = () => {
  return (
    <>
      {' '}
      <Slider
        cardWidth='container'
        visibleCount={VISIBLE_COUNT}
        withSeparators={false}
        className='mt-[70px]'
        title={
          <h4 className='w-[520px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            До / после нашей работы
          </h4>
        }
      >
        {SLIDES.map((slide) => (
          <BeforeAfterSlide key={slide.id} data={slide} />
        ))}
      </Slider>

      <Separator className='mt-[80px]' isFullscreen={true} />
    </>
  )
}

export { BeforeAfter }
