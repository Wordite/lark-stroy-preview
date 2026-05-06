import { RealizationStep } from '@/entities/RealizationStep'
import { Separator } from '@/shared/Separator'

interface IRealizationRoadProps {
  className?: string
  isBorderTopDisabled?: boolean
}

const RealizationRoad = ({ className, isBorderTopDisabled = false }: IRealizationRoadProps) => {
  return (
    <div className={`flex justify-between py-[1.5rem] relative ${className}`}>
      {!isBorderTopDisabled && <Separator isFullscreen={true} className='absolute z-10000! top-0 left-0' />}
      <Separator isFullscreen={true} className='absolute z-5000 bottom-[-0.063rem] left-0' />

      <RealizationStep />
      <RealizationStep />
      <RealizationStep />
      <RealizationStep />
      <RealizationStep />
    </div>
  )
}

export { RealizationRoad }
