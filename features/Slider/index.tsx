'use client'

import { Children, useLayoutEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { SliderButton } from '@/entities/SliderButton'
import { Separator } from '@/shared/Separator'
import { useSlider } from './model/useSlider'
import { SliderSlideContext } from './model/SliderSlideContext'

interface ISliderProps {
  children: ReactNode
  cardWidth: number | 'container'
  visibleCount: number
  title?: ReactNode
  className?: string
  withSeparators?: boolean
}

const Slider = ({
  children,
  cardWidth,
  visibleCount,
  title,
  className,
  withSeparators = true,
}: ISliderProps) => {
  const slides = Children.toArray(children)
  const [measuredWidth, setMeasuredWidth] = useState(0)

  const effectiveCardWidth =
    typeof cardWidth === 'number' ? cardWidth : Math.floor(measuredWidth / visibleCount)

  const { sectionRef, trackRef, headerRef, index, canPrev, canNext, goPrev, goNext } = useSlider({
    totalSlides: slides.length,
    cardWidth: effectiveCardWidth,
    visibleCount,
  })

  useLayoutEffect(() => {
    if (cardWidth !== 'container') return
    const el = sectionRef.current
    if (!el) return
    const update = () => {
      // On narrow viewports each slide should span the full window so the
      // user doesn't see a peek of the next/previous slide on either side.
      const isMobile = window.innerWidth < 768
      setMeasuredWidth(isMobile ? window.innerWidth : el.clientWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [cardWidth, sectionRef])

  const leftBoundaryIdx = index
  const rightBoundaryIdx = index + visibleCount - 1
  const isAutoWidth = cardWidth === 'container'

  return (
    <section ref={sectionRef} className={className}>
      <div ref={headerRef} className='flex justify-between items-end'>
        <div>{title}</div>

        <div className='flex gap-[.938rem]'>
          <SliderButton direction='left' variant='default' onClick={goPrev} disabled={!canPrev} />
          <SliderButton direction='right' variant='accent' onClick={goNext} disabled={!canNext} />
        </div>
      </div>

      {/* Full-width strip: separators span the viewport, slider track lives inside an
          overflow-hidden wrapper that extends past the section padding so the
          edge-card hover bleed reaches the screen edges. */}
      <div className='relative mt-[2.5rem] w-screen -translate-x-(--container-offset)'>
        {withSeparators && (
          <>
            <Separator isFullscreen={false} className='absolute top-0 z-50 left-0 w-screen' />
            <Separator isFullscreen={false} className='absolute bottom-0 z-50 left-0 w-screen' />
          </>
        )}

        <div
          ref={trackRef}
          className='flex will-change-transform pl-(--container-offset) max-md:pl-0 touch-pan-y select-none cursor-grab active:cursor-grabbing'
        >
          {slides.map((slide, i) => {
            const isLeft = i === leftBoundaryIdx
            const isRight = i === rightBoundaryIdx
            const isVisible = i >= leftBoundaryIdx && i <= rightBoundaryIdx
            const boundaryDirection: 'left' | 'right' | undefined = isLeft
              ? 'left'
              : isRight
                ? 'right'
                : undefined
            // Rightmost visible card has no right border; off-screen cards' borders
            // are irrelevant since they're hidden via opacity.
            const isHaveRightBorder = !isRight
            const wrapperStyle: CSSProperties = {
              opacity: isVisible ? 1 : 0,
              pointerEvents: isVisible ? 'auto' : 'none',
              transition: 'opacity 500ms ease',
              // Auto-width mode: slot fills measured container so children using
              // w-full pick up the right size. In fixed mode children declare
              // their own width via Tailwind classes.
              ...(isAutoWidth && effectiveCardWidth > 0 ? { width: effectiveCardWidth } : {}),
            }
            return (
              <SliderSlideContext.Provider
                key={i}
                value={{
                  index: i,
                  isVisible,
                  isOnBoundary: !!boundaryDirection,
                  boundaryDirection,
                  isHaveRightBorder,
                }}
              >
                <div className='shrink-0' style={wrapperStyle}>
                  {slide}
                </div>
              </SliderSlideContext.Provider>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { Slider }
export { useSliderSlide } from './model/SliderSlideContext'
export type { ISliderSlideMeta } from './model/SliderSlideContext'
