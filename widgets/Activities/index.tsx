import { ActivitiesGrid } from '@/features/ActivitiesGrid'
import type { Activity } from '@/services/types'

interface ActivitiesProps {
  activities?: Activity[]
}

const Activities = ({ activities }: ActivitiesProps) => {
  return (
    <section className='mt-[4.375rem]'>
      <h2 className='w-[18.75rem] text-[2.25rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
        Направления деятельности
      </h2>

      <ActivitiesGrid items={activities} />
    </section>
  )
}

export { Activities }
