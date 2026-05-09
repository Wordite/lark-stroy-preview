'use client'

import { useEffect, useRef } from 'react'
import Image, { type StaticImageData } from 'next/image'
import gsap from 'gsap'
import { useSliderSlide } from '@/features/Slider'

export interface IBeforeAfterSlideData {
  id: string
  href?: string
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

  const Overlay = () =>
    data.href ? (
      <a
        href={data.href}
        target='_blank'
        rel='noopener noreferrer'
        className='absolute inset-0 z-20 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'
      >
        <span className='px-[1.125rem] py-[.5rem] border border-accent text-accent text-[.813rem] font-medium uppercase tracking-wider translate-y-[.625rem] hover:translate-y-0 transition-transform duration-300 ease-out'>
          Подробнее
        </span>
      </a>
    ) : null

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
          className='absolute top-[.938rem] left-[.938rem] z-10 text-[.875rem] font-medium uppercase tracking-wider text-text-white bg-black/60 px-[.75rem] py-[.313rem]'
        >
          До
        </span>
        <Overlay />
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
          className='absolute top-[.938rem] right-[.938rem] z-10 text-[.875rem] font-medium uppercase tracking-wider text-text-black bg-accent px-[.75rem] py-[.313rem]'
        >
          После
        </span>
        <Overlay />
      </div>
    </div>
  )
}

export { BeforeAfterSlide }
