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
      className={`${isBorderTopDisabled || isMarginTopDisabled ? '' : 'pt-[55px]'} pb-[77px] relative  flex flex-col`}
    >
      {!isBorderTopDisabled && <Separator className='absolute' isFullscreen={true} />}
      <div className='flex relative'>
        <div className='mt-[97px]'>
          <p ref={labelRef} className='text-[18px] leading-[1em] font-medium text-accent'>
            Готовы обсудить Ваш проект?
          </p>
          <h4
            ref={titleRef}
            className='w-[700px] leading-[1.2em] text-[64px] font-black text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'
          >
            Свяжитесь с нами сегодня!
          </h4>
          <p ref={subtitleRef} className='text-[20px] font-medium text-subtext mt-[15px]'>
            Ответим в течение двух часов, в рабочее время.
          </p>

          <div ref={buttonsRef} className='flex gap-[15px] mt-[28px]'>
            <Button style='accent'>{isSimilarProject ? 'Обсудить похожий проект' : 'Обсудить проект'}</Button>
            <Button style='stroke'>ПОСМОТРЕТЬ ПРОЕКТЫ</Button>
          </div>
        </div>

        <div className='mt-[97px] ml-auto flex flex-col'>
          <DiagonalArrowIcon ref={arrowRef} className='w-[152p] h-[152px] self-end [&>path]:fill-black-light' />

          <div ref={linksRef} className='mt-[90px]'>
            <Link
              className='group text-[18px] flex gap-[15px] items-center font-medium text-text-white transition-colors duration-300 hover:text-accent'
              href='tel:+79781234567'
            >
              <PhoneIcon className='w-[20px] h-[19px] transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-[2px]' />
              <span className='transition-transform duration-300 group-hover:translate-x-[4px]'>
                +7 (978) 123 - 45 - 67
              </span>
            </Link>
            <Link
              className='group text-[18px] flex gap-[15px] items-center font-medium text-text-white transition-colors duration-300 hover:text-accent'
              href='mailto:info@larkstroy.ru'
            >
              <MailIcon className='w-[20px] h-[16px] transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-[2px]' />
              <span className='transition-transform duration-300 group-hover:translate-x-[4px]'>info@larkstroy.ru</span>
            </Link>
          </div>
        </div>

        <Separator
          isVertical={true}
          isFullscreen={true}
          height='474px'
          className={`absolute ${isUnderLongerSlider ? 'right-[334px]' : 'right-[448px]'} translate-y-[1px]`}
        />
      </div>

      <Separator isFullscreen={true} className='absolute bottom-[-5px]' />
    </section>
  )
}

export { Contact }
