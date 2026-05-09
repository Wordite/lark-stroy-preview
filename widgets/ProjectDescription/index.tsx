'use client'

import { useState } from 'react'
import gsap from 'gsap'
import { Button } from '@/shared/Button'
import { Separator } from '@/shared/Separator'
import { useProjectDescriptionAnimation } from './model/useProjectDescriptionAnimation'
import type { Project } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

interface IProjectDescriptionProps {
  project: Project
}

const INITIAL_GALLERY = 4
const LOAD_STEP = 4

const ProjectDescription = ({ project }: IProjectDescriptionProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_GALLERY)
  const {
    sectionRef,
    aboutRef,
    galleryTitleRef,
    galleryRef,
    moreButtonRef,
    specsRef,
  } = useProjectDescriptionAnimation()

  const description = project.description
  const specs = project.characteristics ?? []

  const galleryImages = project.images?.length
    ? project.images.map((i) => mediaUrl(i.url)!)
    : null

  const totalGallery = galleryImages?.length ?? 0
  const canLoadMore = visibleCount < totalGallery

  const handleLoadMore = () => {
    const nextCount = Math.min(totalGallery, visibleCount + LOAD_STEP)
    setVisibleCount(nextCount)
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

  const galleryItems = Array.from({ length: Math.min(visibleCount, totalGallery) }, (_, i) => i)

  return (
    <section ref={sectionRef} className='pt-[1.688rem] pb-[8.125rem] relative flex'>
      <div className='w-[55.75rem] pr-[3.75rem]'>
        <div ref={aboutRef}>
          <p className='text-[1.125rem] font-medium text-text-white'>О проекте</p>
          <p className='mt-[.625rem] text-[1.125rem] text-subtext leading-[1.5em] font-medium whitespace-pre-wrap'>
            {description}
          </p>
        </div>

        {totalGallery > 0 && (
          <h3
            ref={galleryTitleRef}
            className='mt-[2.063rem] text-[1.125rem] font-medium text-text-white'
          >
            Галерея
          </h3>
        )}

        <div ref={galleryRef} className='mt-[.438rem] grid grid-cols-2 gap-[.938rem]'>
          {galleryItems.map((i) => {
            const url = galleryImages?.[i]
            if (!url) return null
            return (
              <div key={i} className='overflow-hidden h-[12.5rem]'>
                <img
                  src={url}
                  alt={`Фото ${i + 1}`}
                  className='w-full h-[12.5rem] object-cover transition-transform duration-500 ease-out hover:scale-[1.04]'
                />
              </div>
            )
          })}
        </div>

        {canLoadMore && (
          <Button
            ref={moreButtonRef}
            style='accent'
            onClick={handleLoadMore}
            className='mt-[.938rem] w-full'
          >
            Больше фото
          </Button>
        )}
      </div>

      <Separator
        isVertical={true}
        isFullscreen={true}
        height='100%'
        className='absolute right-[28rem] top-0'
      />

      <div ref={specsRef} className='flex-1'>
        <p className='text-[1.125rem] font-medium text-accent ml-[1.25rem]'>Характеристики</p>

        <ul className='mt-[1.875rem]'>
          {specs.map((spec) => (
            <li
              key={spec.key}
              className='flex pl-[1.25rem] justify-between items-center py-[.875rem] border-b-[.063rem] border-light-gray-tranpsparent-40 text-[1rem] font-medium'
            >
              <span className='text-text-white text-[1rem]'>{spec.key}</span>
              <span className='text-subtext text-[1rem] text-right'>{spec.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { ProjectDescription }
