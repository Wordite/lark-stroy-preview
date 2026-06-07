// Размеры исходной картинки-карты (assets/images/map.webp). Оверлей-SVG с
// маршрутом использует тот же viewBox, поэтому проценты позиций городов
// переводятся в координаты простым умножением.
export const MAP_IMG_W = 1496
export const MAP_IMG_H = 882

export interface IJourneyCity {
  id: string
  name: string
  period: string
  description: string
  href: string
  image?: string
  // Положение пина в процентах от бокса картинки.
  x: number
  y: number
}

// Ключевые города в хронологическом порядке — по нему рисуется маршрут и
// последовательно появляются карточки проектов.
export const JOURNEY: IJourneyCity[] = [
  {
    id: 'partenit',
    name: 'Партенит',
    period: '2005–2006',
    description: 'Санаторий Минобороны и генеральские корпуса у Медведь-горы',
    href: '/projects',
    x: 48,
    y: 88,
  },
  {
    id: 'simferopol',
    name: 'Симферополь',
    period: '2010',
    description: 'Капитальный ремонт здания МРЭО ГАИ, ул. Узловая 12',
    href: '/projects',
    x: 40,
    y: 68,
  },
  {
    id: 'evpatoria',
    name: 'Евпатория',
    period: '2011–2014',
    description: 'Гостиница «Украина» и спорткомплекс «Арена Крым»',
    href: '/projects',
    x: 21,
    y: 56,
  },
  {
    id: 'yalta',
    name: 'Ялта',
    period: '2015–2018',
    description: 'Два элитных коттеджа на улице Щорса',
    href: '/projects',
    x: 40,
    y: 92,
  },
  {
    id: 'sudak',
    name: 'Судак',
    period: '2020–2021',
    description: 'Производственный цех винзавода «Солнечная долина»',
    href: '/projects',
    x: 63,
    y: 73,
  },
  {
    id: 'kerch',
    name: 'Керчь',
    period: '2026',
    description: 'Реконструкция здания службы безопасности РЖД',
    href: '/projects',
    x: 93,
    y: 45,
  },
]

export const ROUTE_POINTS = JOURNEY.map((c) => ({
  x: (c.x / 100) * MAP_IMG_W,
  y: (c.y / 100) * MAP_IMG_H,
}))

export const ROUTE_PATH = `M ${ROUTE_POINTS.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`
