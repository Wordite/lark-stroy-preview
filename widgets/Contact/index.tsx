'use client'

import { Button } from '@/shared/Button'
import { Separator } from '@/shared/Separator'
import DiagonalArrowIcon from '@/assets/icons/arrow_diagonal.svg'
import Link from 'next/link'
import MailIcon from '@/assets/icons/mail.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import { useContactAnimation } from './model/useContactAnimation'

interface IContactProps {
  isSimilarProject?: boolean
  isUnderLongerSlider?: boolean
  isBorderTopDisabled?: boolean
  isMarginTopDisabled?: boolean
}

const Contact = ({
  isSimilarProject = false,
  isUnderLongerSlider = false,
  isBorderTopDisabled = false,
  isMarginTopDisabled = false,
}: IContactProps) => {
  const { sectionRef, labelRef, titleRef, subtitleRef, buttonsRef, arrowRef, linksRef } = useContactAnimation()

  return (
    <section
      ref={sectionRef}
      className={`${isBorderTopDisabled || isMarginTopDisabled ? '' : 'pt-[3.438rem]'} pb-[4.813rem] relative  flex flex-col`}
    >
      {!isBorderTopDisabled && <Separator className='absolute' isFullscreen={true} />}
      <div className='flex relative'>
        <div className='mt-[6.063rem]'>
          <p ref={labelRef} className='text-[1.125rem] leading-[1em] font-medium text-accent'>
            Готовы обсудить Ваш проект?
          </p>
          <h4
            ref={titleRef}
            className='w-[43.75rem] leading-[1.2em] text-[4rem] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
          >
            Свяжитесь с нами сегодня!
          </h4>
          <p ref={subtitleRef} className='text-[1.25rem] font-medium text-subtext mt-[.938rem]'>
            Ответим в течение двух часов, в рабочее время.
          </p>

          <div ref={buttonsRef} className='flex gap-[.938rem] mt-[1.75rem]'>
            <Button style='accent'>{isSimilarProject ? 'Обсудить похожий проект' : 'Обсудить проект'}</Button>
            <Button style='stroke'>ПОСМОТРЕТЬ ПРОЕКТЫ</Button>
          </div>
        </div>

        <div className='mt-[6.063rem] ml-auto flex flex-col'>
          <DiagonalArrowIcon ref={arrowRef} className='w-[152p] h-[9.5rem] self-end [&>path]:fill-black-light' />

          <div ref={linksRef} className='mt-[5.625rem]'>
            <Link
              className='group text-[1.125rem] flex gap-[.938rem] items-center font-medium text-text-white transition-colors duration-300 hover:text-accent'
              href='tel:+79781234567'
            >
              <PhoneIcon className='w-[1.25rem] h-[1.188rem] transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-[.125rem]' />
              <span className='transition-transform duration-300 group-hover:translate-x-[.25rem]'>
                +7 (978) 123 - 45 - 67
              </span>
            </Link>
            <Link
              className='group text-[1.125rem] flex gap-[.938rem] items-center font-medium text-text-white transition-colors duration-300 hover:text-accent'
              href='mailto:info@larkstroy.ru'
            >
              <MailIcon className='w-[1.25rem] h-[1rem] transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-[.125rem]' />
              <span className='transition-transform duration-300 group-hover:translate-x-[.25rem]'>info@larkstroy.ru</span>
            </Link>
          </div>
        </div>

        <Separator
          isVertical={true}
          isFullscreen={true}
          height='29.625rem'
          className={`absolute ${isUnderLongerSlider ? 'right-[20.875rem]' : 'right-[28rem]'} translate-y-[.063rem]`}
        />
      </div>

      <Separator isFullscreen={true} className='absolute bottom-[-0.313rem]' />
    </section>
  )
}

export { Contact }
