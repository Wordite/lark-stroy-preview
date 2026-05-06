interface IWorkTImeProps {
    className?: string
}

const WorkTime = ({ className }: IWorkTImeProps) => {
  return (
    <div className={className}>
      <p className='text-[1rem] font-medium text-accent'>Режим работы</p>

      <div className='text-[1rem] mt-[1.688rem] font-medium text-text-white flex flex-col gap-[.625rem]'>
        <span>Пн - Пт: 09:00 - 18:00</span>
        <span>Сб: 10:00 - 15:00</span>
        <span>Вс: Выходной</span>
      </div>
    </div>
  )
}

export { WorkTime }
