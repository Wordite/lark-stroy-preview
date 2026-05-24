import Link from 'next/link'
import { links as defaultLinks, type HeaderLink } from '@/widgets/Header/config'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import { DropdownMenu } from '@/widgets/Header/ui/Desktop/DropdownMenu'

interface HeaderLinksProps {
  links?: HeaderLink[]
}

const HeaderLinks = ({ links = defaultLinks }: HeaderLinksProps) => {
  return (
    <div className='flex items-center ml-[2.063rem]'>
      {links.map((link) => (
        <div className='relative group' key={link.href}>
          <Link
            className='flex items-center px-[1.875rem] gap-[.375rem] text-[1rem] font-medium text-text-white uppercase hover:text-accent transition-all duration-300 hover:-translate-y-[.125rem]'
            href={link.href}
          >
            {link.label}

            {link.nestedLinks && (
              <ArrowDownIcon className='w-[.75rem] h-[.438rem] [&>path]:stroke-current transition-transform duration-300 group-hover:rotate-180' />
            )}
          </Link>

          {link.nestedLinks && <DropdownMenu nestedLinks={link.nestedLinks} />}
        </div>
      ))}
    </div>
  )
}

export { HeaderLinks }
