'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import { BurgerButton } from '@/shared/BurgerButton'
import type { HeaderLink } from '@/widgets/Header/config'
import { useMobileMenuAnimation } from './model/useMobileMenuAnimation'

interface IMobileMenuProps {
  links: HeaderLink[]
  logoUrl?: string
  siteTitle?: string
}

const MobileMenu = ({ links }: IMobileMenuProps) => {
  const { isOpen, toggle, close, panelRef, itemsRef, expanded, toggleExpanded, registerSubmenu } =
    useMobileMenuAnimation()
  const pathname = usePathname()

  useEffect(() => {
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      <BurgerButton className='relative z-[60]' isOpen={isOpen} onToggle={toggle} />

      <div
        ref={panelRef}
        style={{ display: 'none' }}
        className='fixed top-[6.25rem] left-0 right-0 bottom-0 z-[19000] bg-background flex-col overflow-y-auto'
      >
        <div ref={itemsRef} className='flex flex-col flex-1 px-[1.25rem] pt-[3rem]'>
          {links.map((link, idx) => {
            const isExpanded = !!expanded[link.href]
            const hasNested = !!link.nestedLinks?.length
            const isLast = idx === links.length - 1
            const rowBorder = !isLast ? 'border-b border-light-gray-tranpsparent-40' : ''
            return (
              <div key={link.href} className={rowBorder}>
                {hasNested ? (
                  <button
                    type='button'
                    onClick={() => toggleExpanded(link.href)}
                    aria-expanded={isExpanded}
                    className='w-full h-[5rem] flex items-center justify-between cursor-pointer text-left leading-none'
                  >
                    <span className='text-[1.5rem] font-medium text-text-white uppercase leading-none transition-colors duration-300'>
                      {link.label}
                    </span>
                    <ArrowDownIcon
                      className={`w-[1rem] h-[.625rem] transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={close}
                    className='flex items-center w-full h-[5rem] text-[1.5rem] font-medium text-text-white uppercase leading-none hover:text-accent transition-colors duration-300'
                  >
                    {link.label}
                  </Link>
                )}

                {hasNested && (
                  <div
                    ref={(el) => registerSubmenu(link.href, el)}
                    style={{ height: 0, opacity: 0, overflow: 'hidden' }}
                  >
                    <div className='flex flex-col pl-[1rem] pb-[.75rem]'>
                      {link.nestedLinks!.map((nested) => (
                        <Link
                          key={nested.href}
                          href={nested.href}
                          onClick={close}
                          className='py-[.75rem] text-[1.375rem] font-medium text-subtext uppercase hover:text-accent transition-colors duration-300'
                        >
                          {nested.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <div className='flex-1 min-h-[4rem]' />

          <Link
            href='/contacts'
            onClick={close}
            className='mb-[1.5rem] text-center font-semibold uppercase text-[1rem] text-text-black px-[1.563rem] py-[1.25rem] bg-accent transition-[filter] duration-300 ease-out hover:brightness-110'
          >
            Обсудить проект
          </Link>
        </div>
      </div>
    </>
  )
}

export { MobileMenu }
