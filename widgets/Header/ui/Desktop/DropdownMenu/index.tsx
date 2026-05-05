'use client'

import { useState } from 'react'
import Link from 'next/link'

interface NestedLink {
  label: string
  href: string
}

interface DropdownMenuProps {
  nestedLinks: NestedLink[]
}

const DropdownMenu = ({ nestedLinks }: DropdownMenuProps) => {
  return (
    <div className='absolute top-full left-0 pt-[10px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300'>
      <div className='flex flex-col bg-black-light/95 backdrop-blur-md border border-light-gray-tranpsparent-40 py-[8px] min-w-[200px] shadow-[0_10px_30px_rgba(0,0,0,0.45)] overflow-hidden'>
        {nestedLinks.map((nestedLink) => (
          <Link
            className='px-[16px] py-[10px] text-[14px] font-medium text-text-white hover:text-accent hover:bg-text-white/5 transition-colors duration-200'
            key={nestedLink.href}
            href={nestedLink.href}
          >
            {nestedLink.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export { DropdownMenu }
