interface IWorkTImeProps {
    className?: string
}

const WorkTime = ({ className }: IWorkTImeProps) => {
  return (
    <div className={className}>
      <p className='text-[16px] font-medium text-accent'>Режим работы</p>

      <div className='text-[16px] mt-[27px] font-medium text-text-white flex flex-col gap-[10px]'>
        <span>Пн - Пт: 09:00 - 18:00</span>
        <span>Сб: 10:00 - 15:00</span>
        <span>Вс: Выходной</span>
      </div>
    </div>
  )
}

export { WorkTime }
