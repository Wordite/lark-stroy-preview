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
    href: '/projects/public/kurortnyy-kompleks-partenit-public-01',
    image: '/projects/kurortnyy-kompleks-partenit-public-01-1-1200x800.jpg',
    x: 48,
    y: 88,
  },
  {
    id: 'simferopol',
    name: 'Симферополь',
    period: '2010',
    description: 'Капитальный ремонт здания МРЭО ГАИ, ул. Узловая 12',
    href: '/projects/public/mreo-gai-simferopol-public-01',
    x: 40,
    y: 68,
  },
  {
    id: 'evpatoria',
    name: 'Евпатория',
    period: '2011–2014',
    description: 'Гостиница «Украина» и спорткомплекс «Арена Крым» (футбольные поля)',
    href: '/projects/public/sportivnyy-kompleks-arena-krym-public-01',
    image: '/projects/sportivnyy-kompleks-arena-krym-public-01-1-1200x800.jpg',
    x: 21,
    y: 56,
  },
  {
    id: 'yalta',
    name: 'Ялта',
    period: '2015–2018',
    description: 'Два элитных коттеджа на улице Щорса',
    href: '/projects/commercial/kottedzhi-shchorsa-yalta-commercial-01',
    x: 40,
    y: 92,
  },
  {
    id: 'sudak',
    name: 'Судак',
    period: '2020–2021',
    description: 'Производственный цех винзавода «Солнечная долина»',
    href: '/projects/manufacture/vinzavod-solnechnaya-dolina-manufacture-01',
    x: 63,
    y: 73,
  },
  {
    id: 'kerch',
    name: 'Керчь',
    period: '2026',
    description: 'Реконструкция здания службы безопасности РЖД',
    href: '/projects/public/zdanie-rzhd-kerch-public-01',
    x: 93,
    y: 45,
  },
]

// Главные города-метки (стиль City-пилюли), но НЕ кликабельные и без карточки.
// Появляются после завершения скролл-анимации маршрута.
export interface IMapPin {
  id: string
  name: string
  x: number
  y: number
}

export const MAIN_CITIES: IMapPin[] = [
  { id: 'bahchisaray', name: 'Бахчисарай', x: 35, y: 76 },
  { id: 'feodosiya', name: 'Феодосия', x: 72, y: 61 },
  { id: 'dzhankoy', name: 'Джанкой', x: 50, y: 28 },
]

// Дополнительные точки без карточки. Не входят в маршрут, показывают только
// название во всплывающей подсказке при наведении.
export interface ILandmark {
  id: string
  name: string
  x: number
  y: number
}

export const LANDMARKS: ILandmark[] = [
  { id: 'artek', name: 'Артек', x: 44, y: 91 },
  { id: 'alushta', name: 'Алушта', x: 50, y: 80 },
  { id: 'saki', name: 'Саки', x: 29, y: 62 },
  { id: 'trudovoe', name: 'Трудовое', x: 43, y: 63 },
  { id: 'znamenka', name: 'Знаменка', x: 49, y: 36 },
]

export const ROUTE_POINTS = JOURNEY.map((c) => ({
  x: (c.x / 100) * MAP_IMG_W,
  y: (c.y / 100) * MAP_IMG_H,
}))

export const ROUTE_PATH = `M ${ROUTE_POINTS.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`
