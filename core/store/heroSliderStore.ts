import { create } from 'zustand'

export interface IHeroSlide {
  id: number
  activity: string
  activityColor: string
  activitySlug: string
  area: string
  city: string
  title: string
  description: string
  year: number
  color: string
  imageUrl?: string
  href?: string
}

interface IHeroSliderStore {
  activeSlide: number
  totalSlides: number
  setTotalSlides: (n: number) => void
  next: () => void
  prev: () => void
  goTo: (n: number) => void
}

export const useHeroSliderStore = create<IHeroSliderStore>((set) => ({
  activeSlide: 1,
  totalSlides: 0,
  setTotalSlides: (n) => set({ totalSlides: n }),
  next: () => set((state) => ({ activeSlide: Math.min(state.activeSlide + 1, state.totalSlides || 1) })),
  prev: () => set((state) => ({ activeSlide: Math.max(state.activeSlide - 1, 1) })),
  goTo: (n) => set({ activeSlide: n }),
}))
