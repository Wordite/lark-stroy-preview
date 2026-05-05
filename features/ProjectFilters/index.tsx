'use client'

import { useState } from 'react'
import { SelectDropdown, type ISelectOption } from '@/shared/SelectDropdown'

interface IProjectFiltersValue {
  year: string
  type: string
  city: string
}

interface IProjectFiltersProps {
  value?: IProjectFiltersValue
  onChange?: (value: IProjectFiltersValue) => void
  className?: string
}

const YEAR_OPTIONS: ISelectOption[] = [
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
]

const TYPE_OPTIONS: ISelectOption[] = [
  { value: 'storage', label: 'Складской комплекс' },
  { value: 'living', label: 'Жилой комплекс' },
  { value: 'commercial', label: 'Торговый объект' },
  { value: 'manufacture', label: 'Производственный объект' },
]

const CITY_OPTIONS: ISelectOption[] = [
  { value: 'simferopol', label: 'Симферополь' },
  { value: 'sevastopol', label: 'Севастополь' },
  { value: 'yalta', label: 'Ялта' },
  { value: 'kerch', label: 'Керчь' },
  { value: 'evpatoria', label: 'Евпатория' },
]

const EMPTY: IProjectFiltersValue = { year: '', type: '', city: '' }

const ProjectFilters = ({ value, onChange, className = '' }: IProjectFiltersProps) => {
  const [internal, setInternal] = useState<IProjectFiltersValue>(EMPTY)
  const isControlled = value !== undefined
  const current = isControlled ? value! : internal

  const update = (next: IProjectFiltersValue) => {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  return (
    <div className={`flex items-center gap-[15px] ${className}`}>
      <SelectDropdown
        compact
        options={YEAR_OPTIONS}
        placeholder='Год'
        value={current.year}
        onChange={(year) => update({ ...current, year })}
      />
      <SelectDropdown
        compact
        options={TYPE_OPTIONS}
        placeholder='Тип'
        value={current.type}
        onChange={(type) => update({ ...current, type })}
      />
      <SelectDropdown
        compact
        options={CITY_OPTIONS}
        placeholder='Город'
        value={current.city}
        onChange={(city) => update({ ...current, city })}
      />
    </div>
  )
}

export { ProjectFilters }
export type { IProjectFiltersValue }
