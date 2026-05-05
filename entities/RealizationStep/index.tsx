interface IRealizationStepProps {
    title:string
    number: string
    desc: string
}

const RealizationStep = () => {
  return (
    <div className='w-[240px]'>
      <p className='text-[56px] font-semibold text-accent leading-[1em]'>01</p>
      <p className='text-[16px] text-text-white font-semibold mt-[6px]'>Проектирование</p>
      <p className='text-[16px] font-medium text-subtext mt-[12px]'>
        Разработка проектной документации с учётом всех требований
      </p>
    </div>
  )
}

export { RealizationStep }
