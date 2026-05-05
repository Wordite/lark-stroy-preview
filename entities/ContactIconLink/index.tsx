import Link from 'next/link'
import { ComponentType, SVGProps } from 'react'

interface IContactIconLinkProps {
  href: string
  text: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  iconClassName: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

const ContactIconLink = ({ href, text, Icon, iconClassName, target, rel }: IContactIconLinkProps) => {
  return (
    <li>
      <Link
        className='group text-[16px] flex gap-[15px] items-center font-medium text-subtext transition-colors duration-300 hover:text-text-white'
        href={href}
        target={target}
        rel={rel}
      >
        <Icon
          className={`${iconClassName} transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-[2px]`}
        />
        <span className='transition-transform duration-300 group-hover:translate-x-[4px]'>
          {text}
        </span>
      </Link>
    </li>
  )
}

export { ContactIconLink }
