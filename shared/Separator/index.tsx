interface ISeparatorProps {
  isVertical?: boolean
  width?: string
  height?: string
  className?: string
  isFullscreen?: boolean
}

const Separator = ({
  isVertical = false,
  width = 'w-screen',
  height = 'h-screen',
  className = '',
  isFullscreen = false,
}: ISeparatorProps) => {
  return (
    <div
      style={{ width: isVertical ? undefined : width, height: isVertical ? height : undefined }}
      className={`${isVertical ? 'w-[.063rem]' : 'h-[.063rem]'} ${
        isFullscreen && isVertical ? 'h-screen'
        : isFullscreen && !isVertical ? 'w-screen -translate-x-(--container-offset)'
        : ''
      } bg-light-gray-tranpsparent-40 ${className}`}
    />
  )
}

export { Separator }
