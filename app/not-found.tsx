import Link from 'next/link'
import { Separator } from '@/shared/Separator'

export default function NotFound() {
  return (
    <div className='mt-[10.625rem]'>
      <Separator isFullscreen={true} className='relative z-[1000]' />
      <div className='min-h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-center py-[5rem] gap-[2rem]'>
        <div className='flex items-center gap-[2rem] text-subtext'>
          <span className='text-[8rem] font-semibold leading-none text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'>
            4
          </span>
          <svg
            viewBox='0 0 24 24'
            className='w-[6.5rem] h-[6.5rem]'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.25'
          >
            <circle cx='10.5' cy='10.5' r='6.5' />
            <line x1='20.5' y1='20.5' x2='15.25' y2='15.25' strokeLinecap='round' />
            <line x1='8' y1='8' x2='13' y2='13' strokeLinecap='round' />
            <line x1='13' y1='8' x2='8' y2='13' strokeLinecap='round' />
          </svg>
          <span className='text-[8rem] font-semibold leading-none text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal)'>
            4
          </span>
        </div>

        <div className='flex flex-col items-center gap-[.625rem]'>
          <h1 className='text-[2.25rem] font-semibold text-text-white leading-[1.2em]'>
            Страница не найдена
          </h1>
          <p className='text-[1.125rem] text-subtext max-w-[32rem]'>
            Возможно, ссылка устарела или страница была перемещена.
          </p>
        </div>

        <Link
          href='/'
          className='inline-flex items-center px-[1.875rem] py-[.875rem] border border-accent text-accent text-[.938rem] font-medium uppercase tracking-wider hover:bg-accent hover:text-text-black transition-colors duration-300'
        >
          На главную
        </Link>
      </div>
      <Separator isFullscreen={true} className='relative z-[1000]' />
    </div>
  )
}
