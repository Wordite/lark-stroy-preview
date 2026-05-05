'use client'

import logo from '@/assets/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { SocialContacts } from '@/entities/SocialContacts'
import { useFooterAnimation } from './model/useFooterAnimation'

const Footer = () => {
  const { footerRef } = useFooterAnimation()

  return (
    <footer
      ref={footerRef}
      className='mt-[90px] px-(--container-offset) pb-[80px] flex justify-between'
    >
      <div className='w-[230px]'>
        <div className='flex items-center gap-[15px]'>
          <Image src={logo} alt='logo' className='w-[24px] h-[31px]' />
          <span className='text-[20px] font-black text-text-white uppercase '>Ларк Строй</span>
        </div>
        <p className='text-[16px] font-medium mt-[18px] text-subtext'>
          Строительная компания полного цикла в Республике Крым. Возводим современные объекты с 2010 года.
        </p>
      </div>

      <div>
        <p className='text-[18px] font-medium text-accent uppercase'>Навигация</p>

        <ul className='mt-[16px] font-medium text-[16px] text-subtext flex flex-col gap-[10px]'>
          <li>
            <Link
              className='inline-block transition-all duration-300 hover:text-text-white hover:translate-x-[4px]'
              href='/'
            >
              О компании
            </Link>
          </li>
          <li>
            <Link
              className='inline-block transition-all duration-300 hover:text-text-white hover:translate-x-[4px]'
              href='/'
            >
              Услуги
            </Link>
          </li>
          <li>
            <Link
              className='inline-block transition-all duration-300 hover:text-text-white hover:translate-x-[4px]'
              href='/'
            >
              Проекты
            </Link>
          </li>
          <li>
            <Link
              className='inline-block transition-all duration-300 hover:text-text-white hover:translate-x-[4px]'
              href='/'
            >
              Контакты
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <p className='text-[18px] font-medium text-accent uppercase'>Контакты</p>
        <SocialContacts />
      </div>
    </footer>
  )
}

export { Footer }
