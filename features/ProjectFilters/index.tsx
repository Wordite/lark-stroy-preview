'use client'

import { useMemo } from 'react'
import { SelectDropdown, type ISelectOption } from '@/shared/SelectDropdown'
import {
  useProjectFiltersUrl,
  EMPTY_FILTERS,
  type ProjectFiltersUrlState,
} from './model/useProjectFiltersUrl'
import type { ProjectCategory } from '@/services/types'

interface IProjectFiltersProps {
  categories?: ProjectCategory[]
  cities?: string[]
  years?: number[]
  className?: string
}

const ProjectFilters = ({
  categories,
  cities = [],
  years,
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
    () => (categories ?? []).map((c) => ({ value: c.slug, label: c.name })),
    [categories],
  )

  const cityOptions: ISelectOption[] = useMemo(
    () => cities.map((c) => ({ value: c, label: c })),
    [cities],
  )

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
      {cityOptions.length > 0 && (
        <SelectDropdown
          compact
          options={cityOptions}
          placeholder='Город'
          value={value.city}
          onChange={(city) => set({ city })}
        />
      )}
      {(value.year || value.type || value.city) && (
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
