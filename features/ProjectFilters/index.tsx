'use client'

import { useMemo } from 'react'
import { SelectDropdown, type ISelectOption } from '@/shared/SelectDropdown'
import {
  useProjectFiltersUrl,
  EMPTY_FILTERS,
  type ProjectFiltersUrlState,
} from './model/useProjectFiltersUrl'
import type { Activity } from '@/services/types'

export interface AreaBucketOption {
  min: number
  max: number | null
  label: string
}

interface IProjectFiltersProps {
  categories?: Activity[]
  cities?: string[]
  years?: number[]
  areaBuckets?: AreaBucketOption[]
  className?: string
}

const DEFAULT_AREA_BUCKETS: AreaBucketOption[] = [
  { min: 0, max: 1000, label: 'до 1 000 м²' },
  { min: 1000, max: 5000, label: '1 000 – 5 000 м²' },
  { min: 5000, max: 10000, label: '5 000 – 10 000 м²' },
  { min: 10000, max: 30000, label: '10 000 – 30 000 м²' },
  { min: 30000, max: null, label: 'более 30 000 м²' },
]

const ProjectFilters = ({
  categories,
  cities = [],
  years,
  areaBuckets,
  className = '',
}: IProjectFiltersProps) => {
  const { value, update } = useProjectFiltersUrl()

  const yearOptions: ISelectOption[] = useMemo(() => {
    const range =
      years ??
      Array.from(
        { length: new Date().getFullYear() - 2017 },
        (_, i) => new Date().getFullYear() - i,
      )
    return range.map((y) => ({ value: String(y), label: String(y) }))
  }, [years])

  const typeOptions: ISelectOption[] = useMemo(
    () => (categories ?? []).map((c) => ({ value: c.slug, label: c.title })),
    [categories],
  )

  const cityOptions: ISelectOption[] = useMemo(
    () => cities.map((c) => ({ value: c, label: c })),
    [cities],
  )

  const buckets = areaBuckets && areaBuckets.length > 0 ? areaBuckets : DEFAULT_AREA_BUCKETS
  const areaOptions: ISelectOption[] = buckets.map((b) => ({
    value: `${b.min}-${b.max ?? ''}`,
    label: b.label,
  }))

  const set = (next: Partial<ProjectFiltersUrlState>) => update({ ...value, ...next })

  return (
    <div className={`flex items-center gap-[.938rem] ${className}`}>
      <SelectDropdown
        compact
        options={yearOptions}
        placeholder='Год'
        value={value.year}
        onChange={(year) => set({ year })}
      />
      {categories !== undefined && (
        <SelectDropdown
          compact
          options={typeOptions}
          placeholder='Тип'
          value={value.type}
          onChange={(type) => set({ type })}
        />
      )}
      <SelectDropdown
        compact
        options={areaOptions}
        placeholder='Площадь'
        value={value.area}
        onChange={(area) => set({ area })}
      />
      {cityOptions.length > 0 && (
        <SelectDropdown
          compact
          options={cityOptions}
          placeholder='Город'
          value={value.city}
          onChange={(city) => set({ city })}
        />
      )}
      {(value.year || value.type || value.city || value.area) && (
        <button
          type='button'
          onClick={() => update(EMPTY_FILTERS)}
          className='text-[.875rem] text-subtext hover:text-accent transition-colors'
        >
          Сбросить
        </button>
      )}
    </div>
  )
}

export { ProjectFilters }
export type { ProjectFiltersUrlState as IProjectFiltersValue }
