import type { InputHTMLAttributes, Ref } from 'react'

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  hasError?: boolean
  ref?: Ref<HTMLInputElement>
}

const Input = ({ className = '', hasError = false, ref, ...rest }: IInputProps) => {
  return (
    <input
      ref={ref}
      {...rest}
      className={`block w-full px-[20px] py-[15px] border-[1px] text-text-white text-[18px] font-medium transition-colors duration-200 ${
        hasError ? 'border-red-500' : 'border-gray-neutral focus:border-accent'
      } outline-none ${className}`}
    />
  )
}

export { Input }
