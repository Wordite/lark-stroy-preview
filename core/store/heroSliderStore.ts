import { create } from 'zustand'

export interface IHeroSlide {
  id: number
  category: string
  area: string
  city: string
  title: string
  description: string
  year: number
  color: string
  imageUrl?: string
  href?: string
}

const FALLBACK_SLIDES: IHeroSlide[] = [
  { id: 1, category: 'Производственные объекты', area: '3 400 м²', city: 'Керчь', title: 'Производственный цех "Севмаш"', description: 'Многопролётный производственный корпус с мостовыми кранами грузоподъёмностью до 20т, виброизолированными фундаментами и промышленной вентиляцией', year: 2022, color: 'hue-rotate-0' },
  { id: 2, category: 'Складские комплексы', area: '5 200 м²', city: 'Симферополь', title: 'Складской комплекс "Логистик"', description: 'Современный логистический центр класса А с автоматизированной системой хранения и зоной кросс-докинга', year: 2023, color: 'hue-rotate-30' },
  { id: 3, category: 'Жилые комплексы', area: '12 800 м²', city: 'Севастополь', title: 'Жилой комплекс "Приморский"', description: 'Монолитно-каркасный жилой комплекс на 120 квартир с подземным паркингом и благоустроенной территорией', year: 2023, color: 'hue-rotate-60' },
  { id: 4, category: 'Офисные здания', area: '4 100 м²', city: 'Краснодар', title: 'Офисный центр "Деловой"', description: 'Бизнес-центр класса B+ с панорамным остеклением', year: 2021, color: 'hue-rotate-90' },
  { id: 5, category: 'Торговые объекты', area: '8 600 м²', city: 'Ялта', title: 'Торговый центр "Южный"', description: 'Двухэтажный торговый центр с атриумом, эскалаторами и парковкой на 200 машиномест', year: 2022, color: 'hue-rotate-120' },
]

interface IHeroSliderStore {
  slides: IHeroSlide[]
  activeSlide: number
  totalSlides: number
  next: () => void
  prev: () => void
  setSlides: (slides: IHeroSlide[]) => void
}

export const useHeroSliderStore = create<IHeroSliderStore>((set) => ({
  slides: FALLBACK_SLIDES,
  activeSlide: 1,
  totalSlides: FALLBACK_SLIDES.length,
  next: () => set((state) => ({ activeSlide: Math.min(state.activeSlide + 1, state.totalSlides) })),
  prev: () => set((state) => ({ activeSlide: Math.max(state.activeSlide - 1, 1) })),
  setSlides: (slides) =>
    set({
      slides: slides.length ? slides : FALLBACK_SLIDES,
      totalSlides: slides.length || FALLBACK_SLIDES.length,
      activeSlide: 1,
    }),
}))
