import { ActivitiesGrid } from '@/features/ActivitiesGrid'
import { Separator } from '@/shared/Separator'

const Activities = () => {
  return (
    <section className='mt-[70px]'>
      <h4 className='w-[300px] text-[36px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
        Направления деятельности
      </h4>

      <ActivitiesGrid />
    </section>
  )
}

export { Activities }
