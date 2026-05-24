interface IRealizationStepProps {
  title: string
  number: string
  description: string
}

const RealizationStep = ({ number, title, description }: IRealizationStepProps) => {
  return (
    <div className='w-[15rem] max-md:w-full max-md:text-center max-md:flex max-md:flex-col max-md:items-center'>
      <p className='text-[3.5rem] max-md:text-[5.25rem] font-semibold text-accent leading-[1em]'>{number}</p>
      <p className='text-[1rem] max-md:text-[1.5rem] text-text-white font-semibold mt-[.375rem] max-md:mt-[.75rem]'>{title}</p>
      <p className='text-[1rem] max-md:text-[1.25rem] font-medium text-subtext mt-[.75rem] max-md:mt-[.875rem] max-md:max-w-[20rem]'>{description}</p>
    </div>
  )
}

export { RealizationStep }
