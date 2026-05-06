'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ArrowIcon from '@/assets/icons/arrow.svg'
import testImage from '@/assets/images/test_photo.png'
import { useProjectHeadAnimation } from './model/useProjectHeadAnimation'
import { Separator } from '@/shared/Separator'
import type { Project } from '@/services/types'

interface IProjectHeadProps {
  project?: Project
}

const ProjectHead = ({ project }: IProjectHeadProps) => {
  const router = useRouter()
  const { rootRef, backRef, titleRef, tagsRef, imageRef } = useProjectHeadAnimation()

  const title = project?.title ?? 'Складной комплекс А-7'
  const completedYear = project?.completedAt
    ? new Date(project.completedAt).getFullYear().toString()
    : null
  const tags = project
    ? ([
        project.category.name,
        project.area ? `${project.area.toLocaleString('ru-RU')} м²` : null,
        project.city,
        completedYear,
      ].filter(Boolean) as string[])
    : ['Складские комплексы', '1, 200 м²', 'Симферополь', '2023']

  const heroImage = project?.mainImage ?? null

  return (
    <section ref={rootRef} className='mt-[10.625rem]'>
      <div className='flex items-start gap-[1.563rem]'>
        <button
          ref={backRef}
          type='button'
          onClick={() => router.back()}
          aria-label='Назад'
          className='group w-[3.375rem] h-[3.375rem] bg-accent flex justify-center items-center cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 hover:-translate-x-[.25rem] shrink-0'
        >
          <ArrowIcon className='w-[1.5rem] h-[1.5rem] [&>path]:stroke-black-light transition-transform duration-300 group-hover:-translate-x-[.188rem]' />
        </button>

        <h1
          ref={titleRef}
          className='w-[37.5rem] pt-[.063rem] text-[2.813rem] leading-[1.1em] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
        >
          {title}
        </h1>
      </div>

      <Separator isFullscreen={true} className='mt-[2.5rem]' />

      <div ref={tagsRef} className='mt-[1.313rem] flex items-center gap-[1.875rem]'>
        {tags.map((tag) => (
          <span key={tag} className='text-[1.125rem] font-medium text-accent'>
            {tag}
          </span>
        ))}
      </div>

      <div ref={imageRef} className='mt-[.938rem] mb-[1.375rem] w-screen -translate-x-(--container-offset) overflow-hidden'>
        {heroImage ? (
          <img src={heroImage} alt={title} className='w-full h-[11.625rem] object-cover' />
        ) : (
          <Image src={testImage} alt={title} className='w-full h-[11.625rem] object-cover' />
        )}
      </div>

      <Separator isFullscreen={true} />
    </section>
  )
}

export { ProjectHead }
