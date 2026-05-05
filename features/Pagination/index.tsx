'use client'

import ArrowIcon from '@/assets/icons/arrow.svg'
import { Button } from '@/shared/Button'
import { Separator } from '@/shared/Separator'
import { usePaginationAnimation } from './model/usePaginationAnimation'

interface IPaginationProps {
  totalPages: number
  currentPage: number
  onChange: (page: number) => void
  className?: string
}

const Pagination = ({ totalPages, currentPage, onChange, className = '' }: IPaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const goPrev = () => canPrev && onChange(currentPage - 1)
  const goNext = () => canNext && onChange(currentPage + 1)

  const { rootRef, pagesRef, buttonsRef } = usePaginationAnimation()

  return (
    <div ref={rootRef} className={className}>
      <Separator isFullscreen={true} className='-translate-y-[1px]' />

      <div className='my-[40px] grid grid-cols-[1fr_auto_1fr] items-center'>
        <div />
        <ul
          ref={pagesRef}
          className='flex items-center justify-self-center  gap-[30px] font-medium text-[18px]'
        >
          {pages.map((page) => {
            const isActive = page === currentPage
            return (
              <li key={page}>
                <button
                  type='button'
                  onClick={() => onChange(page)}
                  className={`cursor-pointer transition-colors duration-200 ${
                    isActive ? 'text-text-white' : 'text-subtext hover:text-text-white'
                  }`}
                >
                  {page}
                </button>
              </li>
            )
          })}
        </ul>

        <div ref={buttonsRef} className='ml-[80px] flex items-center gap-[15px]'>
          <button
            type='button'
            onClick={goPrev}
            disabled={!canPrev}
            aria-label='Предыдущая страница'
            className='group w-[52px] h-[52px] border-[1px] border-text-white flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out hover:bg-text-white disabled:opacity-30 disabled:pointer-events-none'
          >
            <ArrowIcon className='w-[24px] h-[24px] [&>path]:stroke-text-white [&>path]:transition-[stroke] [&>path]:duration-300 group-hover:[&>path]:stroke-text-black' />
          </button>

          <Button style='accent' onClick={goNext} disabled={!canNext}>
            Следующая страница
          </Button>
        </div>
      </div>

      <Separator isFullscreen={true} />
    </div>
  )
}

export { Pagination }
