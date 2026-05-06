'use client'

import logo from '@/assets/images/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import { SocialContacts } from '@/entities/SocialContacts'
import { useFooterAnimation } from './model/useFooterAnimation'
import type { ContactsPublic, FooterColumn } from '@/services/types'

interface FooterClientProps {
  columns: FooterColumn[]
  contacts: ContactsPublic | null
}

const FALLBACK_LINKS = [
  { label: 'О компании', href: '/' },
  { label: 'Услуги', href: '/services' },
  { label: 'Проекты', href: '/projects' },
  { label: 'Контакты', href: '/contacts' },
]

const FooterClient = ({ columns, contacts }: FooterClientProps) => {
  const { footerRef } = useFooterAnimation()
  const settings = contacts?.settings ?? {}
  const tagline =
    settings.site_tagline ||
    'Строительная компания полного цикла в Республике Крым. Возводим современные объекты с 2010 года.'
  const siteTitle = settings.site_title || 'Ларк Строй'
  const logoUrl = settings.site_logo_url

  const visibleColumns = columns.length
    ? columns
    : [
        {
          id: 'fallback',
          title: 'Навигация',
          order: 0,
          links: FALLBACK_LINKS.map((l, i) => ({ id: `f-${i}`, label: l.label, href: l.href, order: i })),
        },
      ]

  return (
    <footer
      ref={footerRef}
      className='mt-[5.625rem] px-(--container-offset) pb-[5rem] flex justify-between'
    >
      <div className='w-[14.375rem]'>
        <div className='flex items-center gap-[.938rem]'>
          {logoUrl ? (
            <img src={logoUrl} alt={siteTitle} className='w-[1.5rem] h-[1.938rem] object-contain' />
          ) : (
            <Image src={logo} alt='logo' className='w-[1.5rem] h-[1.938rem]' />
          )}
          <span className='text-[1.25rem] font-black text-text-white uppercase '>{siteTitle}</span>
        </div>
        <p className='text-[1rem] font-medium mt-[1.125rem] text-subtext'>{tagline}</p>
      </div>

      {visibleColumns.map((col) => (
        <div key={col.id}>
          <p className='text-[1.125rem] font-medium text-accent uppercase'>{col.title}</p>
          <ul className='mt-[1rem] font-medium text-[1rem] text-subtext flex flex-col gap-[.625rem]'>
            {col.links.map((link) => (
              <li key={link.id}>
                <Link
                  className='inline-block transition-all duration-300 hover:text-text-white hover:translate-x-[.25rem]'
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <p className='text-[1.125rem] font-medium text-accent uppercase'>Контакты</p>
        <SocialContacts contacts={contacts} />
      </div>
    </footer>
  )
}

export { FooterClient }
