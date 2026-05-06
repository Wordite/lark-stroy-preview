import ArrowIcon from '@/assets/icons/arrow.svg'

interface ISliderButtonProps {
  className?: string
  direction?: 'left' | 'right'
  variant?: 'default' | 'accent'
  disabled?: boolean
  onClick?: () => void
}

const variantStyles = {
  default: 'border-text-white hover:bg-text-white group',
  accent: 'border-accent bg-accent hover:brightness-110 group'
}

const iconVariantStyles = {
  default:
    '[&>path]:stroke-text-white group-hover:[&>path]:stroke-text-black [&>path]:transition-[stroke,fill] [&>path]:duration-300',
  accent:
    '[&>path]:stroke-text-black group-hover:[&>path]:stroke-text-white [&>path]:transition-[stroke,fill] [&>path]:duration-300',
}

const SliderButton = ({ className, direction = 'left', variant = 'default', disabled = false, onClick }: ISliderButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[4.313rem] h-[4.313rem] border-[.063rem] relative cursor-pointer transition-colors duration-300 ease-out ${variantStyles[variant]} ${disabled ? 'opacity-30 pointer-events-none' : ''} ${className ?? ''}`}
    >
      <ArrowIcon
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${direction === 'right' ? 'rotate-180' : ''} ${iconVariantStyles[variant]}`}
      />
    </button>
  )
}

export { SliderButton }
