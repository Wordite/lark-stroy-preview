import type { Ref, TextareaHTMLAttributes } from 'react'

export interface ITextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  hasError?: boolean
  ref?: Ref<HTMLTextAreaElement>
}

const Textarea = ({ className = '', hasError = false, ref, ...rest }: ITextareaProps) => {
  return (
    <textarea
      ref={ref}
      {...rest}
      className={`block w-full px-[20px] py-[15px] border-[1px] text-text-white text-[18px] font-medium resize-none transition-colors duration-200 ${
        hasError ? 'border-red-500' : 'border-gray-neutral focus:border-accent'
      } outline-none ${className}`}
    />
  )
}

export { Textarea }
