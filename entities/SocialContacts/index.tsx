import Link from 'next/link'
import MailIcon from '@/assets/icons/mail.svg'
import PhoneIcon from '@/assets/icons/phone.svg'
import LocationIcon from '@/assets/icons/location.svg'
import VKIcon from '@/assets/icons/vk.svg'
import TelegramIcon from '@/assets/icons/telegram.svg'
import { ContactIconLink } from '@/entities/ContactIconLink'
import type { ContactsPublic } from '@/services/types'

interface ISocialContactsProps {
  className?: string
  contacts?: ContactsPublic | null
}

const FALLBACK = {
  address: 'Республика Крым',
  addressHref: 'https://yandex.ru/maps/-/CHxNQ8sG',
  phone: '+7 (978) 123 - 45 - 67',
  email: 'info@larkstroy.ru',
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, '')}`
}

const SocialContacts = ({ className = '', contacts }: ISocialContactsProps) => {
  const settings = contacts?.settings ?? {}
  const address = settings.contact_address || FALLBACK.address
  const addressHref = settings.contact_address_href || FALLBACK.addressHref
  const phone = settings.contact_phone || FALLBACK.phone
  const email = settings.contact_email || FALLBACK.email
  const tg = settings.contact_telegram
  const vk = settings.contact_vk
  const wa = settings.contact_whatsapp

  return (
    <ul
      className={`mt-[1rem] font-medium text-[1rem] text-subtext flex flex-col gap-[.625rem] ${className}`}
    >
      <ContactIconLink
        href={addressHref}
        target='_blank'
        rel='noreferrer'
        Icon={LocationIcon}
        iconClassName='w-[1.25rem] h-[1.563rem]'
        text={address}
      />
      <ContactIconLink
        href={telHref(phone)}
        Icon={PhoneIcon}
        iconClassName='w-[1.25rem] h-[1.188rem]'
        text={phone}
      />
      <ContactIconLink
        href={`mailto:${email}`}
        Icon={MailIcon}
        iconClassName='w-[1.25rem] h-[1rem]'
        text={email}
      />

      {(tg || vk || wa) && (
        <li className='flex gap-[.938rem] items-center pt-[.25rem]'>
          {vk && (
            <Link
              href={vk}
              target='_blank'
              rel='noreferrer'
              aria-label='ВКонтакте'
              className='transition-transform duration-300 hover:scale-115 hover:-translate-y-[.125rem]'
            >
              <VKIcon className='w-[1.438rem] h-[1rem]' />
            </Link>
          )}
          {tg && (
            <Link
              href={tg}
              target='_blank'
              rel='noreferrer'
              aria-label='Telegram'
              className='transition-transform duration-300 hover:scale-115 hover:-translate-y-[.125rem]'
            >
              <TelegramIcon className='w-[1.25rem] h-[1rem]' />
            </Link>
          )}
          {wa && (
            <Link
              href={wa}
              target='_blank'
              rel='noreferrer'
              aria-label='WhatsApp'
              className='transition-transform duration-300 hover:scale-115 hover:-translate-y-[.125rem] text-accent text-[.875rem] uppercase font-semibold'
            >
              WA
            </Link>
          )}
        </li>
      )}
    </ul>
  )
}

export { SocialContacts }
