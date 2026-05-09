interface IRealizationStepProps {
  title: string
  number: string
  description: string
}

const RealizationStep = ({ number, title, description }: IRealizationStepProps) => {
  return (
    <div className='w-[15rem]'>
      <p className='text-[3.5rem] font-semibold text-accent leading-[1em]'>{number}</p>
      <p className='text-[1rem] text-text-white font-semibold mt-[.375rem]'>{title}</p>
      <p className='text-[1rem] font-medium text-subtext mt-[.75rem]'>{description}</p>
    </div>
  )
}

export { RealizationStep }
