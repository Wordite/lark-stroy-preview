interface IEmptyStateProps {
  message?: string
  className?: string
}

const EmptyState = ({
  message = 'По заданным фильтрам ничего не найдено.',
  className = '',
}: IEmptyStateProps) => {
  return (
    <div
      className={`h-[28.5rem] flex flex-col items-center justify-center gap-[1.25rem] text-subtext ${className}`}
    >
      <svg
        viewBox='0 0 24 24'
        className='w-[3.75rem] h-[3.75rem]'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.25'
      >
        <circle cx='10.5' cy='10.5' r='6.5' />
        <line x1='20.5' y1='20.5' x2='15.25' y2='15.25' strokeLinecap='round' />
        <line x1='8' y1='8' x2='13' y2='13' strokeLinecap='round' />
        <line x1='13' y1='8' x2='8' y2='13' strokeLinecap='round' />
      </svg>
      <p className='text-[1.125rem]'>{message}</p>
    </div>
  )
}

export { EmptyState }
