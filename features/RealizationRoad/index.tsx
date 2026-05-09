import { RealizationStep } from '@/entities/RealizationStep'
import { Separator } from '@/shared/Separator'
import type { RealizationStep as Step } from '@/services/types'

interface IRealizationRoadProps {
  className?: string
  isBorderTopDisabled?: boolean
  steps?: Step[]
}

const FALLBACK_STEPS: Step[] = [
  { number: '01', title: 'Проектирование', description: 'Разработка проектной документации с учётом всех требований' },
  { number: '02', title: 'Подготовка', description: 'Подготовка площадки и согласование' },
  { number: '03', title: 'Строительство', description: 'Возведение объекта по плану' },
  { number: '04', title: 'Отделка', description: 'Финишные работы и инженерные сети' },
  { number: '05', title: 'Сдача', description: 'Ввод объекта в эксплуатацию' },
]

const RealizationRoad = ({ className, isBorderTopDisabled = false, steps }: IRealizationRoadProps) => {
  const items = (steps && steps.length > 0 ? steps : FALLBACK_STEPS).slice(0, 5)

  return (
    <div className={`flex justify-between py-[1.5rem] relative ${className}`}>
      {!isBorderTopDisabled && <Separator isFullscreen={true} className='absolute z-10000! top-0 left-0' />}
      <Separator isFullscreen={true} className='absolute z-5000 bottom-[-0.063rem] left-0' />

      {items.map((s, i) => (
        <RealizationStep key={i} number={s.number} title={s.title} description={s.description} />
      ))}
    </div>
  )
}

export { RealizationRoad }
