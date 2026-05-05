import Link from 'next/link'
import MailIcon from '@/assets/icons/mail.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import LocationIcon from '@/assets/icons/location.svg'
import VKIcon from '@/assets/icons/vk.svg'
import TelegramIcon from '@/assets/icons/telegram.svg'
import { ContactIconLink } from '@/entities/ContactIconLink'

interface ISocialContactsProps {
  className?: string
}

const SocialContacts = ({ className = '' }: ISocialContactsProps) => {
  return (
    <ul
      className={`mt-[16px] font-medium text-[16px] text-subtext flex flex-col gap-[10px] ${className}`}
    >
      <ContactIconLink
        href='https://yandex.ru/maps/-/CHxNQ8sG'
        target='_blank'
        rel='noreferrer'
        Icon={LocationIcon}
        iconClassName='w-[20px] h-[25px]'
        text='Республика Крым'
      />
      <ContactIconLink
        href='tel:+79781234567'
        Icon={PhoneIcon}
        iconClassName='w-[20px] h-[19px]'
        text='+7 (978) 123 - 45 - 67'
      />
      <ContactIconLink
        href='mailto:info@larkstroy.ru'
        Icon={MailIcon}
        iconClassName='w-[20px] h-[16px]'
        text='info@larkstroy.ru'
      />

      <li className='flex gap-[15px] items-center'>
        <Link
          className='transition-transform duration-300 hover:scale-115 hover:-translate-y-[2px]'
          href='/'
        >
          <VKIcon className='w-[23px] h-[16px]' />
        </Link>
        <Link
          className='transition-transform duration-300 hover:scale-115 hover:-translate-y-[2px]'
          href='/'
        >
          <TelegramIcon className='w-[20px] h-[16px]' />
        </Link>
      </li>
    </ul>
  )
}

export { SocialContacts }
