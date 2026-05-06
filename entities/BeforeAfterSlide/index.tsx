'use client'

import { useEffect, useRef } from 'react'
import Image, { type StaticImageData } from 'next/image'
import gsap from 'gsap'
import { useSliderSlide } from '@/features/Slider'

export interface IBeforeAfterSlideData {
  id: string
  beforeImage: StaticImageData | string
  afterImage: StaticImageData | string
}

interface IBeforeAfterSlideProps {
  data: IBeforeAfterSlideData
}

const BeforeAfterSlide = ({ data }: IBeforeAfterSlideProps) => {
  const { isVisible } = useSliderSlide()
  const afterRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const beforeLabelRef = useRef<HTMLSpanElement>(null)
  const afterLabelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isVisible) return
    gsap.set(afterRef.current, { clipPath: 'inset(0 100% 0 0)' })
    gsap.set(dividerRef.current, { scaleY: 0, transformOrigin: '50% 50%' })
    gsap.set([beforeLabelRef.current, afterLabelRef.current], { opacity: 0, y: -8 })

    const tl = gsap.timeline()
    tl.to(dividerRef.current, { scaleY: 1, duration: 0.5, ease: 'power3.out' })
      .to(
        afterRef.current,
        { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut' },
        '-=0.2',
      )
      .to(
        [beforeLabelRef.current, afterLabelRef.current],
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.1 },
        '-=0.6',
      )
  }, [isVisible, data.id])

  return (
    <div className='flex justify-between w-full'>
      <div className='relative w-[39rem] h-[20.938rem] overflow-hidden'>
        {typeof data.beforeImage === 'string' ? (
          <img
            src={data.beforeImage}
            alt='before'
            className='w-full h-full object-cover grayscale'
          />
        ) : (
          <Image
            src={data.beforeImage}
            alt='before'
            className='w-full h-full object-cover grayscale'
          />
        )}
        <span
          ref={beforeLabelRef}
          className='absolute top-[.938rem] left-[.938rem] text-[.875rem] font-medium uppercase tracking-wider text-text-white bg-black/60 px-[.75rem] py-[.313rem]'
        >
          До
        </span>
      </div>

      <div ref={dividerRef} className='w-[.25rem] h-[20.938rem] bg-text-white' />

      <div ref={afterRef} className='relative w-[39rem] h-[20.938rem] overflow-hidden'>
        {typeof data.afterImage === 'string' ? (
          <img src={data.afterImage} alt='after' className='w-full h-full object-cover' />
        ) : (
          <Image src={data.afterImage} alt='after' className='w-full h-full object-cover' />
        )}
        <span
          ref={afterLabelRef}
          className='absolute top-[.938rem] right-[.938rem] text-[.875rem] font-medium uppercase tracking-wider text-text-black bg-accent px-[.75rem] py-[.313rem]'
        >
          После
        </span>
      </div>
    </div>
  )
}

export { BeforeAfterSlide }
