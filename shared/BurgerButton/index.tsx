'use client'

import { useState } from 'react'

const BurgerButton = ({ className = '' }: { className?: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <button
      className={`relative w-[39px] h-[23px] flex flex-col justify-between cursor-pointer ${className}`}
      onClick={() => setIsOpen(!isOpen)}
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
