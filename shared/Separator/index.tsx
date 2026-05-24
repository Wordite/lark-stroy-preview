interface ISeparatorProps {
  isVertical?: boolean
  width?: string
  height?: string
  className?: string
  isFullscreen?: boolean
  // Блоки поверх тёмного фона (hero, our mission): фиксированно светлая линия
  // в обеих темах, как в тёмной теме.
  onDark?: boolean
}

const Separator = ({
  isVertical = false,
  width = 'w-screen',
  height = 'h-screen',
  className = '',
  isFullscreen = false,
  onDark = false,
}: ISeparatorProps) => {
  return (
    <div
      style={{ width: isVertical ? undefined : width, height: isVertical ? height : undefined }}
      className={`${isVertical ? 'w-[.063rem]' : 'h-[.063rem]'} ${
        isFullscreen && isVertical ? 'h-screen'
        : isFullscreen && !isVertical ? 'w-screen -translate-x-(--container-offset)'
        : ''
      } ${onDark ? 'bg-[rgba(197,199,202,0.4)]' : 'bg-light-gray-tranpsparent-40'} ${className}`}
    />
  )
}

export { Separator }
