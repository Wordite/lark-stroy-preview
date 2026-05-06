import { PropsWithChildren } from 'react'

interface ITagProps extends PropsWithChildren {
  className?: string
  text?: string
}

const Tag = ({ children, className, text = '' }: ITagProps) => {
  return (
    <p className={`inline-flex justify-center items-center h-[1.25rem] px-[.75rem] text-[.938rem] text-subtext border-[.063rem] border-subtext ${className}`}>
      <span>{children || text}</span>
    </p>
  )
}

export { Tag }
