import type { ButtonHTMLAttributes, PropsWithChildren, Ref } from 'react'
import Link from 'next/link'
import DiagonalArrowIcon from '@/assets/icons/arrow_diagonal.svg'

export const STYLES = {
  ACCENT: 'accent',
  STROKE: 'stroke',
} as const

interface IButtonProps
  extends PropsWithChildren,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style' | 'children'> {
  style: 'accent' | 'stroke'
  isLink?: boolean
  href?: string
  className?: string
  isHaveLinkIcon?: boolean
  ref?: Ref<HTMLButtonElement>
}

const baseStyles =
  'h-[3.25rem] px-[1.25rem] flex items-center justify-center gap-[.625rem] cursor-pointer font-medium text-[1.125rem] uppercase transition-colors duration-300 ease-out disabled:opacity-30 disabled:pointer-events-none'
const styles = {
  accent: 'bg-accent text-on-accent hover:brightness-110',
  stroke: 'border-[.063rem] border-text-white text-text-white hover:bg-text-white hover:text-text-black',
}

const Button = ({
  style,
  isLink: _isLink,
  href,
  children,
  className,
  isHaveLinkIcon,
  ref,
  ...rest
}: IButtonProps) => {
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${styles[style]} ${className ?? ''}`}>
        {isHaveLinkIcon && <DiagonalArrowIcon className='w-[1.125rem] h-[1.125rem]' />}
        <span>{children}</span>
      </Link>
    )
  }
  return (
    <button ref={ref} {...rest} className={`${baseStyles} ${styles[style]} ${className ?? ''}`}>
      {isHaveLinkIcon && <DiagonalArrowIcon className='w-[1.125rem] h-[1.125rem]' />}
      <span>{children}</span>
    </button>
  )
}

export { Button }
