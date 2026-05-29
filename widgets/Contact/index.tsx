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
  prefillMessage?: string
  prefillObjectType?: string
}

const Contact = ({
  isSimilarProject = false,
  isUnderLongerSlider = false,
  isBorderTopDisabled = false,
  isMarginTopDisabled = false,
  prefillMessage,
  prefillObjectType,
}: IContactProps) => {
  const { sectionRef, labelRef, titleRef, subtitleRef, buttonsRef, arrowRef, linksRef } = useContactAnimation()

  const contactParams = new URLSearchParams()
  if (prefillMessage) contactParams.set('message', prefillMessage)
  if (prefillObjectType) contactParams.set('objectType', prefillObjectType)
  const contactHref = contactParams.toString() ? `/contacts?${contactParams}` : '/contacts'

  return (
    <section
      ref={sectionRef}
      className={`${isBorderTopDisabled || isMarginTopDisabled ? '' : 'pt-[3.438rem]'} pb-[4.813rem] relative  flex flex-col`}
    >
      {!isBorderTopDisabled && <Separator className='absolute' isFullscreen={true} />}
      <div className='flex max-md:flex-col relative'>
        <div className='mt-[6.063rem] max-md:mt-[3rem]'>
          <p ref={labelRef} className='text-[1.125rem] leading-[1em] font-medium text-accent'>
            Готовы обсудить Ваш проект?
          </p>
          <h4
            ref={titleRef}
            className='w-[43.75rem] max-md:w-full max-md:text-[2.5rem] leading-[1.2em] text-[4rem] font-black text-foreground break-words'
          >
            Свяжитесь с нами сегодня!
          </h4>
          <p ref={subtitleRef} className='text-[1.25rem] font-medium text-subtext mt-[.938rem]'>
            Ответим в течение двух часов, в рабочее время.
          </p>

          <div ref={buttonsRef} className='flex max-md:flex-col gap-[.938rem] mt-[1.75rem]'>
            <Button
              style='accent'
              href={contactHref}
            >
              {isSimilarProject ? 'Обсудить похожий проект' : 'Обсудить проект'}
            </Button>
            <Button style='stroke' href='/projects'>ПОСМОТРЕТЬ ПРОЕКТЫ</Button>
          </div>
        </div>

        <Separator isFullscreen={true} className='hidden max-md:block max-md:mt-[2.5rem] relative z-[5]' />

        <div className='mt-[6.063rem] ml-auto flex flex-col max-md:mt-[2.5rem] max-md:ml-0 max-md:w-full'>
          <DiagonalArrowIcon ref={arrowRef} className='w-[152p] h-[9.5rem] self-end [&_path]:fill-contact-arrow [&_rect]:fill-contact-arrow max-md:hidden' />

          <div ref={linksRef} className='mt-[5.625rem] max-md:mt-0 flex flex-col gap-[.875rem]'>
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

      </div>

      <Separator
        isVertical={true}
        height={
          isBorderTopDisabled || isMarginTopDisabled
            ? 'calc(100% + 0.313rem)'
            : 'calc(100% - 3.125rem)'
        }
        className={`absolute max-md:hidden ${
          isBorderTopDisabled || isMarginTopDisabled ? 'top-0' : 'top-[3.438rem]'
        } ${
          isUnderLongerSlider ? 'right-[20.938rem]' : 'right-[calc(33.333%+0.063rem)]'
        }`}
      />

      <Separator isFullscreen={true} className='absolute bottom-[-0.313rem]' />
    </section>
  )
}

export { Contact }
