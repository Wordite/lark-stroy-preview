interface IRealizationStepProps {
    title:string
    number: string
    desc: string
}

const RealizationStep = () => {
  return (
    <div className='w-[15rem]'>
      <p className='text-[3.5rem] font-semibold text-accent leading-[1em]'>01</p>
      <p className='text-[1rem] text-text-white font-semibold mt-[.375rem]'>Проектирование</p>
      <p className='text-[1rem] font-medium text-subtext mt-[.75rem]'>
        Разработка проектной документации с учётом всех требований
      </p>
    </div>
  )
}

export { RealizationStep }
