'use client'

import slideMaskImage from '@/assets/images/hero_slodier_mask.png'
import Image from 'next/image'
import testPhoto from '@/assets/images/test_photo.png'
import { useHeroSliderStore } from '@/core/store/heroSliderStore'

export interface IHeroSlide {
  id: number
  category: string
  area: string
  city: string
  title: string
  description: string
  year: number
  color: string
}

export const slides: IHeroSlide[] = [
  { id: 1, category: 'Производственные объекты', area: '3 400 м²', city: 'Керчь', title: 'Производственный цех "Севмаш"', description: 'Многопролётный производственный корпус с мостовыми кранами грузоподъёмностью до 20т, виброизолированными фундаментами и промышленной вентиляцией', year: 2022, color: 'hue-rotate-0' },
  { id: 2, category: 'Складские комплексы', area: '5 200 м²', city: 'Симферополь', title: 'Складской комплекс "Логистик"', description: 'Современный логистический центр класса А с автоматизированной системой хранения и зоной кросс-докинга', year: 2023, color: 'hue-rotate-30' },
  { id: 3, category: 'Жилые комплексы', area: '12 800 м²', city: 'Севастополь', title: 'Жилой комплекс "Приморский"', description: 'Монолитно-каркасный жилой комплекс на 120 квартир с подземным паркингом и благоустроенной территорией', year: 2023, color: 'hue-rotate-60' },
  { id: 4, category: 'Офисные здания', area: '4 100 м²', city: 'Краснодар', title: 'Офисный центр "Деловой"', description: 'Бизнес-центр класса B+ с панорамным остеклением, центральным кондиционированием и системой «умный дом»', year: 2021, color: 'hue-rotate-90' },
  { id: 5, category: 'Торговые объекты', area: '8 600 м²', city: 'Ялта', title: 'Торговый центр "Южный"', description: 'Двухэтажный торговый центр с атриумом, эскалаторами и парковкой на 200 машиномест', year: 2022, color: 'hue-rotate-120' },
  { id: 6, category: 'Спортивные объекты', area: '6 300 м²', city: 'Керчь', title: 'Спортивный комплекс "Олимп"', description: 'Многофункциональный спортивный комплекс с бассейном 50м, тренажёрным залом и игровыми площадками', year: 2024, color: 'hue-rotate-150' },
  { id: 7, category: 'Автосервисы', area: '1 800 м²', city: 'Феодосия', title: 'Автосервис "МоторПлюс"', description: 'Автотехнический центр на 12 постов с покрасочной камерой, диагностическим оборудованием и мойкой', year: 2021, color: 'hue-rotate-180' },
  { id: 8, category: 'Медицинские объекты', area: '2 900 м²', city: 'Симферополь', title: 'Медицинский центр "Здоровье"', description: 'Клиника с операционным блоком, лабораторией и стационаром на 40 коек с полным циклом диагностики', year: 2024, color: 'hue-rotate-[210deg]' },
  { id: 9, category: 'Образовательные объекты', area: '7 500 м²', city: 'Севастополь', title: 'Школа "Перспектива"', description: 'Общеобразовательная школа на 600 учеников с актовым залом, спортзалом и современными лабораториями', year: 2023, color: 'hue-rotate-[240deg]' },
  { id: 10, category: 'Общественное питание', area: '950 м²', city: 'Ялта', title: 'Ресторан "Панорама"', description: 'Панорамный ресторан на 150 посадочных мест с открытой террасой и профессиональной кухней', year: 2024, color: 'hue-rotate-[270deg]' },
]

const HeroProjectSlider = () => {
  const { activeSlide } = useHeroSliderStore()

  return (
    <div className='absolute -left-(--container-offset) w-screen h-screen -z-50 overflow-hidden'>
      <Image className='absolute w-screen h-screen z-10' src={slideMaskImage} alt='mask' />
      {slides.map((slide) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            slide.id === activeSlide
              ? 'opacity-100 scale-100'
              : slide.id < activeSlide
                ? 'opacity-0 scale-105 -translate-x-[5%]'
                : 'opacity-0 scale-105 translate-x-[5%]'
          }`}
        >
          <Image
            className={`w-screen h-screen object-cover ${slide.color}`}
            src={testPhoto}
            alt={slide.title}
          />
        </div>
      ))}
    </div>
  )
}

export { HeroProjectSlider }
