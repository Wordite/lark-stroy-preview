import ArrowIcon from '@/assets/icons/arrow.svg'

interface ISliderButtonProps {
  className?: string
  direction?: 'left' | 'right'
  variant?: 'default' | 'accent' | 'onDark'
  disabled?: boolean
  onClick?: () => void
}

const variantStyles = {
  default: 'border-text-white hover:bg-text-white group',
  accent: 'border-accent bg-accent hover:brightness-110 group',
  // всегда поверх тёмного фона (hero) — светлая обводка/стрелка независимо от темы
  onDark: 'border-on-dark hover:bg-on-dark group',
}

const iconVariantStyles = {
  default:
    '[&>path]:stroke-text-white group-hover:[&>path]:stroke-text-black [&>path]:transition [&>path]:duration-300',
  // на жёлтой кнопке стрелка всегда тёмная
  accent:
    '[&>path]:stroke-on-accent [&>path]:transition [&>path]:duration-300',
  onDark:
    '[&>path]:stroke-on-dark group-hover:[&>path]:stroke-on-accent [&>path]:transition [&>path]:duration-300',
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
