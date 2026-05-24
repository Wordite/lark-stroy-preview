'use client'

import { useRouter } from 'next/navigation'
import ArrowIcon from '@/assets/icons/arrow.svg'
import activityHeadBgImage from '@/assets/images/activity_head_bg.webp'
import Image from 'next/image'
import StorageIcon from '@/assets/icons/storage.svg'
import { useActivityHeadAnimation } from './model/useActivityHeadAnimation'
interface IActivityHeadProps {
  activity?: {
    title: string
    description: string
    iconSvg: string | null
  }
}

const ActivityHead = ({ activity }: IActivityHeadProps) => {
  const router = useRouter()
  const { rootRef, backRef, titleRef, descRef } = useActivityHeadAnimation()

  const title = activity?.title ?? 'Складские комплексы'
  const description =
    activity?.description ??
    'Проектирование и строительство современных складов класса А и В. Логистические центры с автоматизированными системами управления.'

  return (
    <div ref={rootRef} className='mt-[10.563rem] max-md:mt-[7rem] min-h-[8rem] py-[.938rem] flex max-md:flex-wrap items-start gap-[1.563rem] max-md:gap-x-[16px] max-md:gap-y-[16px] relative'>
      <Image
        alt='bg'
        src={activityHeadBgImage}
        style={{ filter: 'var(--activity-head-filter)' }}
        className='h-full absolute inset-y-0 left-0 -z-50 -translate-x-(--container-offset) object-cover max-w-none w-auto max-md:hidden'
      />

      <button
        ref={backRef}
        type='button'
        onClick={() => router.back()}
        aria-label='Назад'
        className='group w-[3.375rem] h-[3.375rem] max-md:w-[3rem] max-md:h-[3rem] shrink-0 bg-accent flex justify-center items-center cursor-pointer transition duration-300 ease-out hover:brightness-110 hover:-translate-x-[.25rem]'
      >
        <ArrowIcon className='w-[1.5rem] h-[1.5rem] [&>path]:stroke-on-accent transition-transform duration-300 ease-out group-hover:-translate-x-[.188rem]' />
      </button>

      <div className='flex flex-col max-md:contents'>
        <div ref={titleRef} className='flex items-center gap-[.938rem] max-md:gap-[.75rem]'>
          {activity?.iconSvg ? (
            <span
              className='w-[2.063rem] h-[1.75rem] inline-block [&>svg]:w-full [&>svg]:h-full text-accent shrink-0'
              dangerouslySetInnerHTML={{ __html: activity.iconSvg }}
            />
          ) : (
            <StorageIcon className='w-[2.063rem] h-[1.75rem] shrink-0' />
          )}
          <span className='text-[2.25rem] max-md:text-[1.75rem] leading-[1.1em] font-semibold text-foreground break-words'>{title}</span>
        </div>

        <p
          ref={descRef}
          className='text-[1.125rem] w-[43.75rem] max-w-[43.75rem] mt-[.875rem] max-md:mt-0 max-md:w-full max-md:max-w-full max-md:basis-full max-md:text-[18px] text-subtext leading-[1.4em] whitespace-pre-wrap'
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export { ActivityHead }
