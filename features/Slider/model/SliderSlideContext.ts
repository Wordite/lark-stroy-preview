'use client'

import { createContext, useContext } from 'react'

export interface ISliderSlideMeta {
  index: number
  isVisible: boolean
  isOnBoundary: boolean
  boundaryDirection?: 'left' | 'right'
  isHaveRightBorder: boolean
}

const defaultMeta: ISliderSlideMeta = {
  index: 0,
  isVisible: true,
  isOnBoundary: false,
  isHaveRightBorder: false,
}

export const SliderSlideContext = createContext<ISliderSlideMeta>(defaultMeta)

export const useSliderSlide = () => useContext(SliderSlideContext)
