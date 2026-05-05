import Link from 'next/link'
import { links } from '@/widgets/Header/config'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'
import { DropdownMenu } from '@/widgets/Header/ui/Desktop/DropdownMenu'

const HeaderLinks = () => {
  return (
    <div className='flex items-center ml-[33px]'>
      {links.map((link) => (
        <div className='relative group' key={link.href}>
          <Link
            className='flex items-center px-[30px] gap-[6px] text-[16px] font-medium text-text-white uppercase hover:text-accent transition-all duration-300 hover:-translate-y-[2px]'
            href={link.href}
          >
            {link.label}

            {link.nestedLinks && (
              <ArrowDownIcon className='w-[12px] h-[7px] transition-transform duration-300 group-hover:rotate-180' />
            )}
          </Link>

          {link.nestedLinks && <DropdownMenu nestedLinks={link.nestedLinks} />}
        </div>
      ))}
    </div>
  )
}

export { HeaderLinks }
