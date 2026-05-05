import type { ButtonHTMLAttributes, PropsWithChildren, Ref } from 'react'
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
  className?: string
  isHaveLinkIcon?: boolean
  ref?: Ref<HTMLButtonElement>
}

const baseStyles =
  'h-[52px] px-[20px] flex items-center justify-center gap-[10px] cursor-pointer font-medium text-[18px] uppercase transition-colors duration-300 ease-out disabled:opacity-30 disabled:pointer-events-none'
const styles = {
  accent: 'bg-accent text-text-black hover:brightness-110',
  stroke: 'border-[1px] border-text-white text-text-white hover:bg-text-white hover:text-text-black',
}

const Button = ({
  style,
  isLink: _isLink,
  children,
  className,
  isHaveLinkIcon,
  ref,
  ...rest
}: IButtonProps) => {
  return (
    <button ref={ref} {...rest} className={`${baseStyles} ${styles[style]} ${className ?? ''}`}>
      {isHaveLinkIcon && <DiagonalArrowIcon className='w-[18px] h-[18px]' />}
      <span>{children}</span>
    </button>
  )
}

export { Button }
