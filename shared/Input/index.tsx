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
      className={`block w-full px-[1.25rem] py-[.938rem] border-[.063rem] text-text-white text-[1.125rem] font-medium transition-colors duration-200 ${
        hasError ? 'border-red-500' : 'border-gray-neutral focus:border-accent'
      } outline-none ${className}`}
    />
  )
}

export { Input }
