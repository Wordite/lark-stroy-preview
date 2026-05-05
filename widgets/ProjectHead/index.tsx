'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ArrowIcon from '@/assets/icons/arrow.svg'
import testImage from '@/assets/images/test_photo.png'
import { useProjectHeadAnimation } from './model/useProjectHeadAnimation'
import { Separator } from '@/shared/Separator'

const TAGS = ['Складские комплексы', '1, 200 м²', 'Симферополь', '2023']

const ProjectHead = () => {
  const router = useRouter()
  const { rootRef, backRef, titleRef, tagsRef, imageRef } = useProjectHeadAnimation()

  return (
    <section ref={rootRef} className='mt-[170px]'>
      <div className='flex items-start gap-[25px]'>
        <button
          ref={backRef}
          type='button'
          onClick={() => router.back()}
          aria-label='Назад'
          className='group w-[54px] h-[54px] bg-accent flex justify-center items-center cursor-pointer transition-[filter,transform] duration-300 hover:brightness-110 hover:-translate-x-[4px] shrink-0'
        >
          <ArrowIcon className='w-[24px] h-[24px] [&>path]:stroke-black-light transition-transform duration-300 group-hover:-translate-x-[3px]' />
        </button>

        <h1
          ref={titleRef}
          className='w-[600px] pt-[1px] text-[45px] leading-[1.1em] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
        >
          Складной комплекс А-7
        </h1>
      </div>

      <Separator isFullscreen={true} className='mt-[40px]' />

      <div ref={tagsRef} className='mt-[21px] flex items-center gap-[30px]'>
        {TAGS.map((tag) => (
          <span key={tag} className='text-[18px] font-medium text-accent'>
            {tag}
          </span>
        ))}
      </div>

      <div ref={imageRef} className='mt-[15px] mb-[22px] w-screen -translate-x-(--container-offset) overflow-hidden'>
        <Image src={testImage} alt='Складной комплекс А-7' className='w-full h-[186px] object-cover' />
      </div>

      <Separator isFullscreen={true} />
    </section>
  )
}

export { ProjectHead }
