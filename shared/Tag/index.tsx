import { PropsWithChildren } from 'react'

interface ITagProps extends PropsWithChildren {
  className?: string
  text?: string
}

const Tag = ({ children, className, text = '' }: ITagProps) => {
  return (
    <p className={`inline-flex justify-center items-center h-[20px] px-[12px] text-[15px] text-subtext border-[1px] border-subtext ${className}`}>
      <span>{children || text}</span>
    </p>
  )
}

export { Tag }
