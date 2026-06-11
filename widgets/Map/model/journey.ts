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

// Ключевые города в хронологическом порядке — по нему летит птица, рисуется
// золотой след и последовательно появляются карточки проектов.
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

// Второстепенные города: появляются золотыми точками после завершения
// основного маршрута. Клик — птица летит туда и показывает карточку.
// TODO: заменить period/description/href на реальные проекты.
export const SECONDARY_CITIES: IJourneyCity[] = [
  {
    id: 'bahchisaray',
    name: 'Бахчисарай',
    period: '2008–2009',
    description: 'Отделочные и кровельные работы на объектах города',
    href: '/projects',
    x: 35,
    y: 76,
  },
  {
    id: 'dzhankoy',
    name: 'Джанкой',
    period: '2013',
    description: 'Ремонт производственных и складских помещений',
    href: '/projects',
    x: 50,
    y: 28,
  },
  {
    id: 'feodosiya',
    name: 'Феодосия',
    period: '2022–2023',
    description: 'Реконструкция коммерческих помещений в центре города',
    href: '/projects',
    x: 69.5,
    y: 61,
  },
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

export interface IPoint {
  x: number
  y: number
}

export const toMapPoint = (c: { x: number; y: number }): IPoint => ({
  x: (c.x / 100) * MAP_IMG_W,
  y: (c.y / 100) * MAP_IMG_H,
})

export const ROUTE_POINTS = JOURNEY.map(toMapPoint)

// Птица парит чуть выше точки города, чтобы не закрывать пилюлю с названием.
export const BIRD_LIFT = 52

// Дуга между двумя точками: квадратичная кривая с подъёмом перпендикулярно
// отрезку — полёт выглядит живее прямой линии. Дуга всегда выгибается вверх.
export const curveBetween = (a: IPoint, b: IPoint, bow = 0.18): string => {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  let px = -dy / len
  let py = dx / len
  if (py > 0) {
    px = -px
    py = -py
  }
  const lift = len * bow
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${(mx + px * lift).toFixed(1)} ${(my + py * lift).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

const lifted = (p: IPoint): IPoint => ({ x: p.x, y: p.y - BIRD_LIFT })

// След рисуется между точками городов, птица летит по параллельной дуге выше.
export const TRAIL_SEGMENTS_D = ROUTE_POINTS.slice(1).map((p, i) => curveBetween(ROUTE_POINTS[i], p))
export const FLIGHT_SEGMENTS_D = ROUTE_POINTS.slice(1).map((p, i) => curveBetween(lifted(ROUTE_POINTS[i]), lifted(p)))

export const flightPathTo = (from: IPoint, to: { x: number; y: number }): string =>
  curveBetween(from, lifted(toMapPoint(to)), 0.14)
