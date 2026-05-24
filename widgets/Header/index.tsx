import Link from 'next/link'
import Image from 'next/image'
import LogoImage from '@/assets/images/logo.png'
import { HeaderLinks } from './ui/Desktop/HeaderLinks'
import { MobileMenu } from './ui/Mobile/MobileMenu'
import { ThemeToggle } from '@/shared/ThemeToggle'
import { buildLinks } from './config'
import { fetchActivities } from '@/services/entities/activities'
import { fetchContacts } from '@/services/entities/contacts'
import { mediaUrl } from '@/services/mediaUrl'

const Header = async () => {
  const [activities, contacts] = await Promise.all([fetchActivities(), fetchContacts()])
  const navLinks = buildLinks(activities ?? [])
  const logoUrl = mediaUrl(contacts?.settings?.site_logo_url)
  const siteTitle = contacts?.settings?.site_title || 'Ларк Строй'

  return (
    <header className='fixed bg-background w-full top-0 left-0 right-0 z-[20000] h-[6.25rem] border-b-[.063rem] border-light-gray-tranpsparent-40'>
      <div className='container px-[3.125rem] max-lg:!w-full max-lg:!max-w-full max-md:!px-[1.25rem] flex justify-between items-center w-full h-full'>
        <div className='flex items-center justify-between'>
          <Link className='flex items-center gap-[.938rem] max-lg:scale-115 max-lg:origin-left' href='/'>
            {logoUrl ? (
              <img className='w-[1.5rem] h-[1.938rem] object-contain' src={logoUrl} alt={siteTitle} />
            ) : (
              <Image className='w-[1.5rem] h-[1.938rem]' src={LogoImage} alt='Logo' />
            )}
            <span className='text-[1.25rem] font-black uppercase text-text-white'>{siteTitle}</span>
          </Link>
        </div>

        <div className='max-lg:hidden contents'>
          <HeaderLinks links={navLinks} />
        </div>

        <div className='flex items-center gap-[.75rem] ml-[2.5rem] max-lg:hidden'>
          <Link
            href='/contacts'
            className='uppercase text-[1rem] text-on-accent px-[1.563rem] py-[1.563rem] bg-accent transition duration-300 ease-out hover:brightness-110'
          >
            Обсудить проект
          </Link>
          <ThemeToggle />
        </div>

        <div className='hidden max-lg:block'>
          <MobileMenu links={navLinks} logoUrl={logoUrl} siteTitle={siteTitle} />
        </div>
      </div>
    </header>
  )
}

export { Header }
