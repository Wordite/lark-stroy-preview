import { create } from 'zustand'

const TOTAL_SLIDES = 10

interface IHeroSliderStore {
    activeSlide: number
    totalSlides: number
    next: () => void
    prev: () => void
}

const useHeroSliderStore = create<IHeroSliderStore>((set) => ({
  activeSlide: 1,
  totalSlides: TOTAL_SLIDES,
  next: () => set((state) => ({
    activeSlide: Math.min(state.activeSlide + 1, state.totalSlides)
  })),
  prev: () => set((state) => ({
    activeSlide: Math.max(state.activeSlide - 1, 1)
  }))
}))

export { useHeroSliderStore }
