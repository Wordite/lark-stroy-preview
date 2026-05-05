import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CRIMEA_CONTOUR, SEVASTOPOL_CONTOUR } from './crimeaContour'

gsap.registerPlugin(ScrollTrigger)

// Outer rectangle for inverse mask — large enough to cover the viewport
// at any zoom level the user can pan/zoom to. In Yandex order [lat, lng].
const MASK_OUTER_RING: [number, number][] = [
  [35.0, 20.0],
  [35.0, 50.0],
  [55.0, 50.0],
  [55.0, 20.0],
  [35.0, 20.0],
]

const MASK_FILL = 'rgba(17, 21, 23, 1)'

// Combined bbox for Crimea + Sevastopol — limits panning and drives the
// adaptive zoom calculation below. Padded ~0.4° on each side so the
// peninsula has visible margin around it.
const CRIMEA_BOUNDS: [[number, number], [number, number]] = [
  [43.80, 32.60],  // SW: south of Sevastopol coast, west of peninsula
  [46.60, 36.95],  // NE: north of Perekop, east of Kerch
]

// Compute a fractional zoom that makes CRIMEA_BOUNDS fill ~FILL_RATIO of
// the smaller viewport dimension. Recomputed on resize so the peninsula
// occupies a consistent portion of the screen regardless of width.
// MAX_ZOOM caps the result on wide screens (≥1580px tend to over-zoom
// because both width and height grow); above the cap the peninsula stays
// fixed in pixels and just occupies a smaller fraction of the viewport.
const FILL_RATIO = 0.85
const MAX_ZOOM = 7.8
const computeFitZoom = (w: number, h: number): number => {
  const [[swLat, swLng], [neLat, neLng]] = CRIMEA_BOUNDS
  const lngSpan = neLng - swLng
  const latSpan = neLat - swLat
  const cosLat = Math.cos(((swLat + neLat) / 2) * Math.PI / 180)
  // ppd_lng = 256 * 2^z / 360; ppd_lat = ppd_lng / cos(lat).
  // Solve for ppd_lng such that bbox * ppd fills FILL_RATIO * viewport.
  const ppdByWidth = (w * FILL_RATIO) / lngSpan
  const ppdByHeight = ((h * FILL_RATIO) / latSpan) * cosLat
  const ppd = Math.min(ppdByWidth, ppdByHeight)
  const zoom = Math.log2((ppd * 360) / 256)
  return Math.min(zoom, MAX_ZOOM)
}

declare global {
  interface Window {
    ymaps: any
  }
}

interface IMapPoint {
  id: string
  coords: [number, number]
  title: string
  category: string
  description: string
}

const MAP_POINTS: IMapPoint[] = [
  { id: '1', coords: [45.3531, 36.4743], title: 'Производственный цех "Севмаш"', category: 'Производственные объекты', description: '3 400 м² — Керчь' },
  { id: '2', coords: [44.9521, 34.1024], title: 'Складской комплекс "Логистик"', category: 'Складские комплексы', description: '5 200 м² — Симферополь' },
  { id: '3', coords: [44.6167, 33.5254], title: 'Жилой комплекс "Приморский"', category: 'Жилые комплексы', description: '12 800 м² — Севастополь' },
  { id: '4', coords: [44.4952, 34.1663], title: 'Торговый центр "Южный"', category: 'Торговые объекты', description: '8 600 м² — Ялта' },
  { id: '5', coords: [45.1197, 35.3773], title: 'Автосервис "МоторПлюс"', category: 'Автосервисы', description: '1 800 м² — Феодосия' },
  { id: '6', coords: [44.9481, 33.7767], title: 'Школа "Перспектива"', category: 'Образовательные объекты', description: '7 500 м² — Бахчисарай' },
]

export const useYandexMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [activePoint, setActivePoint] = useState<IMapPoint | null>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (sectionRef.current && infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            once: true,
          },
        }
      )
    }
  }, [])

  useEffect(() => {
    const CRIMEA_CENTER: [number, number] = [
      (CRIMEA_BOUNDS[0][0] + CRIMEA_BOUNDS[1][0]) / 2,
      (CRIMEA_BOUNDS[0][1] + CRIMEA_BOUNDS[1][1]) / 2,
    ]

    const initMap = () => {
      if (!window.ymaps || !mapContainerRef.current) return
      if (mapInstanceRef.current) return

      window.ymaps.ready(() => {
        const containerEl = mapContainerRef.current!
        const initialZoom = computeFitZoom(containerEl.clientWidth, containerEl.clientHeight)

        const map = new window.ymaps.Map(containerEl, {
          center: CRIMEA_CENTER,
          zoom: initialZoom,
          controls: [],
        }, {
          suppressMapOpenBlock: true,
          // Lock pan to the Crimea+Sevastopol bbox.
          restrictMapArea: CRIMEA_BOUNDS,
        })

        // Inverse polygon mask: outer rectangle + two holes (Crimea + Sevastopol).
        // Yandex Polygon uses evenOdd fill rule — each inner ring punches a hole.
        const maskPolygon = new window.ymaps.Polygon(
          [MASK_OUTER_RING, CRIMEA_CONTOUR, SEVASTOPOL_CONTOUR],
          {},
          {
            fillColor: MASK_FILL,
            strokeWidth: 0,
            interactivityModel: 'default#transparent',
          }
        )
        map.geoObjects.add(maskPolygon)

        map.behaviors.enable(['drag', 'multiTouch'])
        map.behaviors.disable(['scrollZoom', 'dblClickZoom'])

        // Re-fit on resize: recompute zoom from current container size so
        // the peninsula keeps the same visual proportions across viewports.
        const handleResize = () => {
          map.container.fitToViewport()
          const z = computeFitZoom(containerEl.clientWidth, containerEl.clientHeight)
          map.setCenter(CRIMEA_CENTER, z)
        }
        window.addEventListener('resize', handleResize)
        map.__resizeHandler = handleResize

        mapInstanceRef.current = map

        // Add points with custom placemarks
        MAP_POINTS.forEach((point) => {
          const placemark = new window.ymaps.Placemark(
            point.coords,
            {
              hintContent: point.title,
            },
            {
              iconLayout: 'default#image',
              iconImageHref: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="rgba(243,188,24,1)" stroke="rgba(17,21,23,1)" stroke-width="3"/>
                  <circle cx="16" cy="16" r="5" fill="rgba(17,21,23,1)"/>
                </svg>
              `),
              iconImageSize: [32, 32],
              iconImageOffset: [-16, -16],
            }
          )

          placemark.events.add('click', () => {
            setActivePoint(point)
          })

          placemark.events.add('mouseenter', () => {
            placemark.options.set('iconImageSize', [40, 40])
            placemark.options.set('iconImageOffset', [-20, -20])
          })

          placemark.events.add('mouseleave', () => {
            placemark.options.set('iconImageSize', [32, 32])
            placemark.options.set('iconImageOffset', [-16, -16])
          })

          map.geoObjects.add(placemark)
        })
      })
    }

    if (window.ymaps) {
      initMap()
    } else {
      const interval = setInterval(() => {
        if (window.ymaps) {
          clearInterval(interval)
          initMap()
        }
      }, 200)
      return () => clearInterval(interval)
    }

    return () => {
      if (mapInstanceRef.current) {
        if (mapInstanceRef.current.__resizeHandler) {
          window.removeEventListener('resize', mapInstanceRef.current.__resizeHandler)
        }
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return {
    mapContainerRef,
    sectionRef,
    infoRef,
    activePoint,
    setActivePoint,
    points: MAP_POINTS,
  }
}
