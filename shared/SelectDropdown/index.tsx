'use client'

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type Ref,
  type SVGProps,
} from 'react'
import ArrowDownIcon from '@/assets/icons/arrow_down.svg'

export interface ISelectOption {
  value: string
  label: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconClassName?: string
}

interface ISelectDropdownProps {
  options: ISelectOption[]
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  name?: string
  className?: string
  hasError?: boolean
  ref?: Ref<HTMLButtonElement>
  // Compact variant: h-47, tight inline button (gap 23 between text and chevron),
  // auto width based on content. Used in filter rows.
  compact?: boolean
}

const SelectDropdown = ({
  options,
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  name,
  className = '',
  hasError = false,
  ref,
  compact = false,
}: ISelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
        onBlur?.()
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        onBlur?.()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onBlur])

  const handleSelect = (option: ISelectOption) => {
    onChange?.(option.value)
    setIsOpen(false)
    onBlur?.()
  }

  return (
    <div
      ref={rootRef}
      className={`${compact ? 'inline-block' : ''} relative ${isOpen ? 'z-[10000]' : 'z-[1]'} ${className}`}
    >
      <input type='hidden' name={name} value={value} readOnly />

      <button
        ref={ref}
        type='button'
        onClick={() => setIsOpen((o) => !o)}
        className={`group border-[1px] text-left text-[18px] font-medium transition-colors duration-200 cursor-pointer flex items-center ${
          compact
            ? 'h-[47px] px-[18px] gap-[23px] w-auto'
            : 'block w-full px-[20px] py-[15px] justify-between gap-[12px]'
        } ${
          hasError
            ? 'border-red-500'
            : compact
              ? 'border-text-white hover:border-accent'
              : 'border-gray-neutral hover:border-accent'
        } ${isOpen ? 'border-accent' : ''}`}
      >
        <span
          className={`flex items-center gap-[12px] ${
            selected || compact ? 'text-text-white' : 'text-subtext'
          }`}
        >
          {selected?.Icon && (
            <selected.Icon className={selected.iconClassName ?? 'w-[22px] h-[22px]'} />
          )}
          <span>{selected?.label ?? placeholder}</span>
        </span>
        <ArrowDownIcon
          className={`w-[12px] h-[7px] transition-transform duration-300 [&>path]:stroke-text-white ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role='listbox'
          className='absolute top-full left-0 mt-[6px] z-[10000] min-w-full w-max max-w-[360px] flex flex-col bg-black-light/85 backdrop-blur-xl border border-light-gray-tranpsparent-40 shadow-[0_15px_40px_rgba(0,0,0,0.6)] py-[6px] max-h-[300px] overflow-y-auto'
        >
          {options.map((option) => {
            const isActive = option.value === value
            return (
              <li key={option.value}>
                <button
                  type='button'
                  onClick={() => handleSelect(option)}
                  className={`w-full flex items-center gap-[14px] px-[20px] py-[12px] text-left text-[16px] font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-accent bg-text-white/5'
                      : 'text-text-white hover:text-accent hover:bg-text-white/5'
                  }`}
                >
                  {option.Icon && (
                    <option.Icon className={option.iconClassName ?? 'w-[22px] h-[22px]'} />
                  )}
                  <span>{option.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export { SelectDropdown }
