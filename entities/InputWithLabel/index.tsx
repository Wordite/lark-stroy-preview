import type { InputHTMLAttributes, Ref, TextareaHTMLAttributes } from 'react'
import { Input } from '@/shared/Input'
import { Textarea } from '@/shared/Textarea'

interface IInputWithLabelProps {
  label: string
  error?: string
  asTextarea?: boolean
  ref?: Ref<HTMLInputElement> | Ref<HTMLTextAreaElement>
  // Common controlled-input props that are supplied by react-hook-form's
  // register / Controller. Rest are forwarded directly to the underlying
  // input or textarea.
  [key: string]: unknown
}

const InputWithLabel = ({
  label,
  error,
  asTextarea = false,
  ref,
  ...rest
}: IInputWithLabelProps) => {
  const hasError = Boolean(error)

  return (
    <div>
      <span className='font-semibold text-[16px] block text-accent'>{label}</span>
      {asTextarea ? (
        <Textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={ref as Ref<HTMLTextAreaElement>}
          hasError={hasError}
          className='mt-[8px] min-h-[120px]'
        />
      ) : (
        <Input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          ref={ref as Ref<HTMLInputElement>}
          hasError={hasError}
          className='mt-[8px]'
        />
      )}
      {error && (
        <span className='block mt-[6px] text-[14px] font-medium text-red-500'>{error}</span>
      )}
    </div>
  )
}

export { InputWithLabel }
