'use client'

import { useState } from 'react'

interface IBurgerButtonProps {
  className?: string
  isOpen?: boolean
  onToggle?: () => void
}

const BurgerButton = ({ className = '', isOpen: controlledOpen, onToggle }: IBurgerButtonProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const handleClick = () => {
    if (onToggle) onToggle()
    else setInternalOpen((v) => !v)
  }
  return (
    <button
      className={`relative w-[39px] h-[23px] flex flex-col justify-between cursor-pointer ${className}`}
      onClick={handleClick}
      aria-label='Меню'
    >
      <span
        className={`block w-[39px] h-[1px] bg-light-gray transition-all duration-300 origin-center ${
          isOpen ? 'translate-y-[11px] rotate-45' : ''
        }`}
      />
      <span
        className={`block w-[39px] h-[1px] bg-light-gray transition-all duration-300 ${
          isOpen ? 'opacity-0 scale-x-0' : ''
        }`}
      />
      <span
        className={`block w-[39px] h-[1px] bg-light-gray transition-all duration-300 origin-center ${
          isOpen ? '-translate-y-[11px] -rotate-45' : ''
        }`}
      />
    </button>
  )
}

export { BurgerButton }
