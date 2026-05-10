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
    <div ref={rootRef} className='mt-[169px] min-h-[128px] py-[15px] flex gap-[25px] relative'>
      <Image
        alt='bg'
        src={activityHeadBgImage}
        className='w-[1004px] h-full absolute inset-y-0 left-0 -z-50 -translate-x-(--container-offset) object-cover'
      />

      <button
        ref={backRef}
        type='button'
        onClick={() => router.back()}
        aria-label='Назад'
        className='group w-[54px] h-[54px] bg-accent flex justify-center items-center cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 hover:-translate-x-[4px]'
      >
        <ArrowIcon className='w-[24px] h-[24px] [&>path]:stroke-black-light transition-transform duration-300 group-hover:-translate-x-[3px]' />
      </button>

      <div>
        <div ref={titleRef} className='flex items-center gap-[15px]'>
          {activity?.iconSvg ? (
            <span
              className='w-[33px] h-[28px] inline-block [&>svg]:w-full [&>svg]:h-full text-accent'
              dangerouslySetInnerHTML={{ __html: activity.iconSvg }}
            />
          ) : (
            <StorageIcon className='w-[33px] h-[28px]' />
          )}
          <span className='text-[36px] leading-[1em] font-semibold text-text-white'>{title}</span>
        </div>

        <p ref={descRef} className='text-[18px] w-[700px] mt-[14px] text-subtext leading-[1.4em] whitespace-pre-wrap'>
          {description}
        </p>
      </div>
    </div>
  )
}

export { ActivityHead }
