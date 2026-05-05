'use client'

import { useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import testImage from '@/assets/images/test_photo.png'
import { Button } from '@/shared/Button'
import { Separator } from '@/shared/Separator'
import { useProjectDescriptionAnimation } from './model/useProjectDescriptionAnimation'

interface ISpec {
  label: string
  value: string
}

const SPECS: ISpec[] = [
  { label: 'Класс', value: 'А' },
  { label: 'Этажность', value: '1' },
  { label: 'Высота потолков', value: '12 м' },
  { label: 'Тип покрытия', value: 'Многослойный полимер' },
  { label: 'Температурный режим', value: '+18...+25°C' },
]

const INITIAL_GALLERY = 4
const LOAD_STEP = 4
const TOTAL_GALLERY = 12

const ProjectDescription = () => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY)
  const {
    sectionRef,
    aboutRef,
    galleryTitleRef,
    galleryRef,
    moreButtonRef,
    specsRef,
  } = useProjectDescriptionAnimation()

  const handleLoadMore = () => {
    const nextCount = Math.min(TOTAL_GALLERY, visibleCount + LOAD_STEP)
    setVisibleCount(nextCount)
    // After React commits new images, fade them in.
    requestAnimationFrame(() => {
      if (!galleryRef.current) return
      const all = galleryRef.current.querySelectorAll(':scope > *')
      const fresh = Array.from(all).slice(visibleCount, nextCount)
      if (fresh.length) {
        gsap.fromTo(
          fresh,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: 0.07,
            clearProps: 'transform',
          },
        )
      }
    })
  }

  const galleryItems = Array.from({ length: visibleCount }, (_, i) => i)
  const canLoadMore = visibleCount < TOTAL_GALLERY

  return (
    <section ref={sectionRef} className='pt-[27px] pb-[130px] relative flex'>
      <div className='w-[892px] pr-[60px]'>
        <div ref={aboutRef}>
          <p className='text-[18px] font-medium text-text-white'>О проекте</p>
          <p className='mt-[10px] text-[18px] text-subtext leading-[1.5em] font-medium'>
            Современный складской комплекс класса А, оснащённый автоматизированной системой управления, погрузочными
            доками с гидравлическими уравнительными платформами и современной системой пожаротушения. Объект построен
            в рекордные сроки — 8 месяцев.
          </p>
        </div>

        <h3
          ref={galleryTitleRef}
          className='mt-[33px] text-[18px] font-medium text-text-white'
        >
          Галерея
        </h3>

        <div ref={galleryRef} className='mt-[7px] grid grid-cols-2 gap-[15px]'>
          {galleryItems.map((i) => (
            <div key={i} className='overflow-hidden'>
              <Image
                src={testImage}
                alt={`Фото ${i + 1}`}
                className='w-full h-[200px] object-cover transition-transform duration-500 ease-out hover:scale-[1.04]'
              />
            </div>
          ))}
        </div>

        {canLoadMore && (
          <Button
            ref={moreButtonRef}
            style='accent'
            onClick={handleLoadMore}
            className='mt-[15px] w-full'
          >
            Больше фото
          </Button>
        )}
      </div>

      <Separator
        isVertical={true}
        isFullscreen={true}
        height='100%'
        className='absolute right-[448px] top-0'
      />

      <div ref={specsRef} className='flex-1'>
        <p className='text-[18px] font-medium text-accent ml-[20px]'>Характеристики</p>

        <ul className='mt-[30px]'>
          {SPECS.map((spec) => (
            <li
              key={spec.label}
              className='flex pl-[20px] justify-between items-center py-[14px] border-b-[1px] border-light-gray-tranpsparent-40 text-[16px] font-medium'
            >
              <span className='text-text-white text-[16px]'>{spec.label}</span>
              <span className='text-subtext text-[16px] text-right'>{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { ProjectDescription }
