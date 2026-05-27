import { useRef, useEffect, useState, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CRIMEA_CONTOUR, SEVASTOPOL_CONTOUR } from './crimeaContour'
import type { MapPoint } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

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

// Заливка инверсной маски читается из CSS-переменной --map-mask, чтобы
// совпадать с фоном текущей темы (тёмный в dark, светлый в light).
const readMaskFill = (): string => {
  if (typeof window === 'undefined') return 'rgba(17, 21, 23, 1)'
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue('--map-mask')
    .trim()
  return v || 'rgba(17, 21, 23, 1)'
}

// Раздуваем контуры маски на 20% от общего центра, чтобы «окно» в маске
// захватывало больше пространства вокруг полуострова.
const GEO_EXPAND = 1.2
const scaleRing = (
  ring: [number, number][],
  [cLat, cLng]: [number, number],
  k: number,
): [number, number][] =>
  ring.map(([lat, lng]) => [cLat + (lat - cLat) * k, cLng + (lng - cLng) * k])

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
// Отдалено относительно прежних значений (0.85 / 7.8): полуостров занимает
// меньшую долю экрана, восточные объекты (Керчь) не уходят под правый UI.
const FILL_RATIO = 0.58
const MAX_ZOOM = 5.7
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
    [key: string]: any
  }
}

// Уникальное имя namespace на каждую загрузку, чтобы ymaps не ругался
// «api is already enabled on this page with same namespace» при возврате
// на страницу с картой.
let ymapsNsCounter = 0
const nextYmapsNs = () => `ymaps_${Date.now()}_${++ymapsNsCounter}`

interface IMapPoint {
  id: string
  coords: [number, number]
  title: string
  activity: string
  activitySlug: string
  description: string
  color: string
  iconSvg?: string | null
  href?: string
  imageUrl?: string | null
}

export interface IMapActivity {
  slug: string
  title: string
}

function adaptPoints(input?: MapPoint[]): IMapPoint[] {
  if (!input?.length) return []
  return input
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      id: p.id,
      coords: [p.latitude, p.longitude] as [number, number],
      title: p.title,
      activity: p.activity.title,
      activitySlug: p.activity.slug,
      description: [p.area ? `${p.area.toLocaleString('ru-RU')} м²` : null, p.city]
        .filter(Boolean)
        .join(' — ') || p.activity.title,
      color: p.activity.color,
      iconSvg: p.activity.iconSvg,
      href: `/projects/${p.activity.slug}/${p.slug}`,
      imageUrl: mediaUrl(p.mainImage),
    }))
}

export const useYandexMap = (sourcePoints?: MapPoint[]) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [activePoint, setActivePoint] = useState<IMapPoint | null>(null)
  const mapInstanceRef = useRef<any>(null)
  const points = useMemo(() => adaptPoints(sourcePoints), [sourcePoints])

  // Уникальные категории объектов для селекта-фильтра.
  const activities = useMemo<IMapActivity[]>(() => {
    const seen = new Map<string, string>()
    points.forEach((p) => {
      if (!seen.has(p.activitySlug)) seen.set(p.activitySlug, p.activity)
    })
    return Array.from(seen, ([slug, title]) => ({ slug, title }))
  }, [points])

  // По умолчанию показываем только первую категорию.
  const [selectedActivity, setSelectedActivity] = useState('')
  useEffect(() => {
    if (activities.length && !activities.some((a) => a.slug === selectedActivity)) {
      setSelectedActivity(activities[0].slug)
    }
  }, [activities, selectedActivity])

  const placemarksRef = useRef<any>(null)
  const selectedActivityRef = useRef(selectedActivity)
  selectedActivityRef.current = selectedActivity
  const pointsRef = useRef(points)
  pointsRef.current = points
  const [renderTick, setRenderTick] = useState(0)

  const zoomIn = () => {
    const m = mapInstanceRef.current
    if (m) m.setZoom(m.getZoom() + 1, { duration: 200 })
  }
  const zoomOut = () => {
    const m = mapInstanceRef.current
    if (m) m.setZoom(m.getZoom() - 1, { duration: 200 })
  }

  // Чистая функция рендера — берёт всё нужное из ref'ов, чтобы быть
  // независимой от React-замыканий. Вызывается и из ymaps.ready (initial),
  // и из эффекта при смене selectedActivity / points.
  const renderPlacemarks = () => {
    const placemarks = placemarksRef.current
    if (!placemarks || !window.ymaps) return
    placemarks.removeAll()
    const slug = selectedActivityRef.current
    pointsRef.current
      .filter((p) => !slug || p.activitySlug === slug)
      .forEach((p) => placemarks.add(buildPlacemark(p, setActivePoint)))
  }

  // Перерисовка при смене категории / появлении карты / смене points.
  useEffect(() => {
    if (!placemarksRef.current) return
    setActivePoint(null)
    renderPlacemarks()
  }, [selectedActivity, points, renderTick])

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
          [
            MASK_OUTER_RING,
            scaleRing(CRIMEA_CONTOUR, CRIMEA_CENTER, GEO_EXPAND),
            scaleRing(SEVASTOPOL_CONTOUR, CRIMEA_CENTER, GEO_EXPAND),
          ],
          {},
          {
            fillColor: readMaskFill(),
            strokeWidth: 0,
            interactivityModel: 'default#transparent',
          }
        )
        map.geoObjects.add(maskPolygon)

        // Перекрашиваем маску под фон при переключении темы (data-theme
        // на <html>), чтобы тёмный прямоугольник не оставался поверх
        // светлой карты и наоборот.
        const themeObserver = new MutationObserver(() => {
          maskPolygon.options.set('fillColor', readMaskFill())
        })
        themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-theme'],
        })
        map.__themeObserver = themeObserver

        map.behaviors.enable(['drag', 'multiTouch'])
        map.behaviors.disable(['scrollZoom', 'dblClickZoom'])
        // map.behaviors.disable(['dblClickZoom'])

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

        // Отдельная коллекция для меток. Делаем первичный рендер сразу
        // (через ref'ы — независимо от свежести React-замыкания), а
        // последующие смены категории прокидываются через renderTick.
        const placemarks = new window.ymaps.GeoObjectCollection()
        map.geoObjects.add(placemarks)
        placemarksRef.current = placemarks
        renderPlacemarks()
        setRenderTick((t) => t + 1)
      })
    }

    // Грузим скрипт ymaps руками с уникальным namespace, чтобы ymaps не
    // ругался «api is already enabled on this page with same namespace» при
    // повторных монтированиях (StrictMode dev, возврат на главную и т.д.).
    // После загрузки алиасим под window.ymaps — остальной код работает с ним.
    const ns = nextYmapsNs()
    const YMAPS_SRC = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&ns=${ns}`
    let scriptEl: HTMLScriptElement | null = null
    let cancelled = false

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        scriptEl = document.createElement('script')
        scriptEl.src = YMAPS_SRC
        scriptEl.async = true
        scriptEl.dataset.ymapsLoader = ns
        scriptEl.onload = () => resolve()
        scriptEl.onerror = () => reject(new Error('ymaps script load failed'))
        document.head.appendChild(scriptEl)
      })

    loadScript()
      .then(() => {
        if (cancelled) return
        window.ymaps = window[ns]
        initMap()
      })
      .catch((err) => console.error(err))

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        if (mapInstanceRef.current.__resizeHandler) {
          window.removeEventListener('resize', mapInstanceRef.current.__resizeHandler)
        }
        if (mapInstanceRef.current.__themeObserver) {
          mapInstanceRef.current.__themeObserver.disconnect()
        }
        try {
          mapInstanceRef.current.destroy()
        } catch {}
        mapInstanceRef.current = null
      }
      placemarksRef.current = null
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl)
      document
        .querySelectorAll('script[src*="api-maps.yandex.ru"], script[src*="yastatic.net/s3/mapsapi"]')
        .forEach((s) => s.parentNode?.removeChild(s))
      try {
        delete (window as any).ymaps
        delete (window as any)[ns]
      } catch {
        ;(window as any).ymaps = undefined
        ;(window as any)[ns] = undefined
      }
    }
  }, [points])

  return {
    mapContainerRef,
    sectionRef,
    infoRef,
    activePoint,
    setActivePoint,
    points,
    activities,
    selectedActivity,
    setSelectedActivity,
    zoomIn,
    zoomOut,
  }
}

function buildPlacemark(point: IMapPoint, onSelect: (p: IMapPoint) => void) {
  const inner = point.iconSvg
    ? (() => {
        const { content, viewBox } = parseSvg(point.iconSvg!)
        return `<svg x="8" y="8" width="16" height="16" viewBox="${viewBox}" fill="rgba(17,21,23,1)" stroke="rgba(17,21,23,1)" preserveAspectRatio="xMidYMid meet">${content}</svg>`
      })()
    : `<circle cx="16" cy="16" r="5" fill="rgba(17,21,23,1)"/>`
  const placemark = new window.ymaps.Placemark(
    point.coords,
    { hintContent: point.title },
    {
      iconLayout: 'default#image',
      iconImageHref:
        'data:image/svg+xml,' +
        encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="${point.color}" stroke="rgba(17,21,23,1)" stroke-width="3"/>
            ${inner}
          </svg>
        `),
      iconImageSize: [32, 32],
      iconImageOffset: [-16, -16],
    },
  )

  placemark.events.add('click', () => onSelect(point))
  placemark.events.add('mouseenter', () => {
    placemark.options.set('iconImageSize', [40, 40])
    placemark.options.set('iconImageOffset', [-20, -20])
  })
  placemark.events.add('mouseleave', () => {
    placemark.options.set('iconImageSize', [32, 32])
    placemark.options.set('iconImageOffset', [-16, -16])
  })

  return placemark
}

function stripSvgWrapper(svg: string): string {
  // Pull contents out of an outer <svg>...</svg> so we can re-embed inside another svg.
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  return m ? m[1] : svg
}

function parseSvg(svg: string): { content: string; viewBox: string } {
  const viewBoxMatch = svg.match(/viewBox\s*=\s*["']([^"']+)["']/i)
  let viewBox = viewBoxMatch?.[1]
  if (!viewBox) {
    const widthMatch = svg.match(/<svg[^>]*\swidth\s*=\s*["']?(\d+(?:\.\d+)?)/i)
    const heightMatch = svg.match(/<svg[^>]*\sheight\s*=\s*["']?(\d+(?:\.\d+)?)/i)
    const w = Number(widthMatch?.[1]) || 24
    const h = Number(heightMatch?.[1]) || 24
    viewBox = `0 0 ${w} ${h}`
  }
  return { content: stripSvgWrapper(svg), viewBox }
}
