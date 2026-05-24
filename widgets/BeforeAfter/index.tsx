'use client'

import { BeforeAfterSlide, type IBeforeAfterSlideData } from '@/entities/BeforeAfterSlide'
import { Slider } from '@/features/Slider'
import { Separator } from '@/shared/Separator'
import type { HomeBlockPublic } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

const VISIBLE_COUNT = 1

interface IBeforeAfterProps {
  block?: HomeBlockPublic | null
}

const BeforeAfter = ({ block }: IBeforeAfterProps = {}) => {
  const slides: IBeforeAfterSlideData[] = (block?.projects ?? [])
    .filter((p) => p.previousImage?.url && p.mainImage)
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      href: `/projects/${p.activity.slug}/${p.slug}`,
      beforeImage: mediaUrl(p.previousImage!.url)!,
      afterImage: mediaUrl(p.mainImage)!,
    }))

  if (slides.length === 0) return null

  return (
    <>
      <Slider
        cardWidth='container'
        visibleCount={VISIBLE_COUNT}
        withSeparators={false}
        className='mt-[4.375rem]'
        title={
          <h4 className='w-[32.5rem] max-md:w-full max-md:text-[1.75rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
            {block?.title || 'До / после нашей работы'}
          </h4>
        }
      >
        {slides.map((slide) => (
          <BeforeAfterSlide key={slide.id} data={slide} />
        ))}
      </Slider>

      <Separator className='mt-[5rem]' isFullscreen={true} />
    </>
  )
}

export { BeforeAfter }
