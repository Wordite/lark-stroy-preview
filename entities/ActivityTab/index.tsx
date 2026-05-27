import Link from 'next/link'
import DiagonalArrowIcon from '@/assets/icons/arrow_diagonal.svg'
import type { CSSProperties, ComponentType, SVGProps } from 'react'

export interface IActivityData {
  id: string
  href: string
  title: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  iconClass: string
  color: string
  description: string
  bullets: string[]
  iconSvg?: string
}

interface IActivityTabProps {
  data: IActivityData
  isHaveTopBorder?: boolean
  isHaveBottomBorder?: boolean
  isHaveLeftBorder?: boolean
  isHaveRightBorder?: boolean
  isHaveLeftOffset?: boolean
  boundaryDirection?: 'left' | 'right'
}

const ActivityTab = ({
  data,
  isHaveTopBorder = false,
  isHaveBottomBorder = false,
  isHaveLeftBorder = false,
  isHaveRightBorder = false,
  isHaveLeftOffset = false,
  boundaryDirection,
}: IActivityTabProps) => {
  const Icon = data.Icon
  const colorStyle = { '--cat-color': data.color } as CSSProperties

  return (
    <Link
      href={data.href}
      style={colorStyle}
      className={`group block relative py-[1.5rem] ${isHaveLeftOffset ? 'md:pl-[6.875rem]' : ''} ${isHaveTopBorder ? 'border-t-[.063rem] border-light-gray-tranpsparent-40' : ''} ${isHaveBottomBorder ? 'border-b-[.063rem] border-light-gray-tranpsparent-40' : ''} ${isHaveLeftBorder ? 'border-l-[.063rem] border-light-gray-tranpsparent-40' : ''} ${isHaveRightBorder ? 'max-md:border-r-0 border-r-[.063rem] border-light-gray-tranpsparent-40' : ''}`}
    >
      <div
        className='pointer-events-none absolute inset-0 -z-40 opacity-0 group-hover:opacity-10 transition-opacity duration-300 max-md:hidden'
        style={{ backgroundColor: data.color }}
      />
      {boundaryDirection === 'left' && (
        <div
          className='pointer-events-none h-full w-screen opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-50 absolute top-0 right-full'
          style={{ backgroundColor: data.color }}
        />
      )}
      {boundaryDirection === 'right' && (
        <div
          className='pointer-events-none h-full w-screen opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-50 absolute top-0 left-full'
          style={{ backgroundColor: data.color }}
        />
      )}
      <div
        className='hidden max-md:block pointer-events-none h-full w-screen opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-50 absolute top-0 left-1/2 -translate-x-1/2'
        style={{ backgroundColor: data.color }}
      />
      <div className='flex items-center gap-[.938rem]'>
        {data.iconSvg ? (
          <span
            className={`${data.iconClass} inline-block [&_svg]:w-full [&_svg]:h-full [&_svg]:fill-current [&_path]:fill-current [&_path]:!fill-current transition-colors duration-300`}
            style={{ color: data.color }}
            dangerouslySetInnerHTML={{ __html: data.iconSvg }}
          />
        ) : (
          <Icon
            className={`${data.iconClass} [&_path]:fill-current transition-colors duration-300`}
            style={{ color: data.color }}
          />
        )}
        <h5
          className='text-[1.125rem] font-semibold transition-colors duration-300'
          style={{ color: data.color }}
        >
          {data.title}
        </h5>
      </div>
      <p className='text-[1.125rem] font-medium text-text-white mt-[1.125rem] w-[30rem] max-md:w-full'>{data.description}</p>

      <div className='mt-[1.75rem] flex items-end justify-between gap-[1.5rem] pr-[1.5rem]'>
        <ul className='list-disc marker:text-[.75rem] text-[1.125rem] font-medium text-subtext ml-[1.5rem]'>
          {data.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <DiagonalArrowIcon className='shrink-0 w-[2.25rem] h-[2.25rem] [&>path]:fill-dark-gray group-hover:[&>path]:fill-(--cat-color) group-hover:translate-x-[.375rem] group-hover:-translate-y-[.375rem] transition-all duration-300 ease-out' />
      </div>
    </Link>
  )
}

export { ActivityTab }
