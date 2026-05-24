'use client'

import { useRouter } from 'next/navigation'
import ArrowIcon from '@/assets/icons/arrow.svg'
import { useProjectHeadAnimation } from './model/useProjectHeadAnimation'
import { Separator } from '@/shared/Separator'
import type { Project } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

interface IProjectHeadProps {
  project: Project
}

const ProjectHead = ({ project }: IProjectHeadProps) => {
  const router = useRouter()
  const { rootRef, backRef, titleRef, tagsRef, imageRef } = useProjectHeadAnimation()

  const title = project.title
  const completedYear = project.completedAt
    ? new Date(project.completedAt).getFullYear().toString()
    : null
  const tags = [
    project.activity.title,
    project.area ? `${project.area.toLocaleString('ru-RU')} м²` : null,
    project.city,
    completedYear,
  ].filter(Boolean) as string[]

  const heroImage = mediaUrl(project.mainImage) ?? null

  return (
    <section ref={rootRef} className='mt-[10.625rem]'>
      <div className='flex items-start gap-[1.563rem] max-md:gap-[1rem] max-md:items-center'>
        <button
          ref={backRef}
          type='button'
          onClick={() => router.back()}
          aria-label='Назад'
          className='group w-[3.375rem] h-[3.375rem] max-md:w-[3rem] max-md:h-[3rem] bg-accent flex justify-center items-center cursor-pointer transition duration-300 ease-out hover:brightness-110 hover:-translate-x-[.25rem] shrink-0'
        >
          <ArrowIcon className='w-[1.5rem] h-[1.5rem] [&>path]:stroke-on-accent transition-transform duration-300 ease-out group-hover:-translate-x-[.188rem]' />
        </button>

        <h1
          ref={titleRef}
          className='w-[37.5rem] max-md:w-full max-md:text-[1.75rem] pt-[.063rem] text-[2.813rem] leading-[1.1em] font-semibold text-foreground break-words'
        >
          {title}
        </h1>
      </div>

      <Separator isFullscreen={true} className='mt-[2.5rem]' />

      <div
        ref={tagsRef}
        className='mt-[1.313rem] flex items-center gap-[1.875rem] flex-wrap max-md:gap-x-[1.25rem] max-md:gap-y-[.5rem]'
      >
        {tags.map((tag) => (
          <span key={tag} className='text-[1.125rem] font-medium text-accent'>
            {tag}
          </span>
        ))}
      </div>

      {heroImage && (
        <div ref={imageRef} className='mt-[.938rem] mb-[1.375rem] w-screen -translate-x-(--container-offset) overflow-hidden'>
          <img src={heroImage} alt={title} className='w-full h-[11.625rem] object-cover' />
        </div>
      )}

      <Separator isFullscreen={true} />
    </section>
  )
}

export { ProjectHead }
