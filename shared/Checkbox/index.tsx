import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  error?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        <label htmlFor={checkboxId} className='flex items-start gap-3 cursor-pointer group'>
          <div className='relative shrink-0 mt-[.125rem]'>
            <input
              ref={ref}
              type='checkbox'
              id={checkboxId}
              className='peer sr-only'
              {...props}
            />
            <div
              className={`
                w-[1.25rem] h-[1.25rem] rounded border transition-all duration-200
                border-light-gray-tranpsparent-40 bg-black-light
                peer-checked:bg-accent peer-checked:border-accent
                peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40
                group-hover:border-accent/60
                ${error ? 'border-red-500/60' : ''}
              `}
            />
            <svg
              className='
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[.75rem] h-[.75rem] text-text-black pointer-events-none
                opacity-0 scale-50 transition-all duration-200
                peer-checked:opacity-100 peer-checked:scale-100
              '
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={3}
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          </div>
          {label && (
            <span className='text-[.875rem] leading-[1.4em] text-subtext select-none'>{label}</span>
          )}
        </label>
        {error && <span className='text-[.75rem] text-red-400 ml-[2rem]'>{error}</span>}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
