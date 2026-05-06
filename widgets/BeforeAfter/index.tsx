'use client'

import testImage from '@/assets/images/test_photo.png'
import { BeforeAfterSlide, type IBeforeAfterSlideData } from '@/entities/BeforeAfterSlide'
import { Slider } from '@/features/Slider'
import { Separator } from '@/shared/Separator'
import type { HomeBlockPublic } from '@/services/types'

const VISIBLE_COUNT = 1

const FALLBACK_SLIDES: IBeforeAfterSlideData[] = [
  { id: 'ba-1', beforeImage: testImage, afterImage: testImage },
  { id: 'ba-2', beforeImage: testImage, afterImage: testImage },
]

interface IBeforeAfterProps {
  block?: HomeBlockPublic | null
}

const BeforeAfter = ({ block }: IBeforeAfterProps = {}) => {
  // Only projects that have BOTH a previousImage (до) and a mainImage (после)
  // can be shown as a before/after pair.
  const slides: IBeforeAfterSlideData[] = (block?.projects ?? [])
    .filter((p) => p.previousImage?.url && p.mainImage)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      beforeImage: p.previousImage!.url,
      afterImage: p.mainImage!,
    }))

  const finalSlides = slides.length > 0 ? slides : FALLBACK_SLIDES

  return (
    <>
      <Slider
        cardWidth='container'
        visibleCount={VISIBLE_COUNT}
        withSeparators={false}
        className='mt-[4.375rem]'
        title={
          <h4 className='w-[32.5rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            {block?.title || 'До / после нашей работы'}
          </h4>
        }
      >
        {finalSlides.map((slide) => (
          <BeforeAfterSlide key={slide.id} data={slide} />
        ))}
      </Slider>

      <Separator className='mt-[5rem]' isFullscreen={true} />
    </>
  )
}

export { BeforeAfter }
