import type { IHeroSlide } from '@/core/store/heroSliderStore'
import type { Project } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

const COLOR_FILTERS = [
  'hue-rotate-0',
  'hue-rotate-30',
  'hue-rotate-60',
  'hue-rotate-90',
  'hue-rotate-120',
  'hue-rotate-150',
  'hue-rotate-180',
  'hue-rotate-[210deg]',
  'hue-rotate-[240deg]',
  'hue-rotate-[270deg]',
]

export function projectsToSlides(projects: Project[]): IHeroSlide[] {
  return projects.map((p, i) => ({
    id: i + 1,
    activity: p.activity.title,
    activityColor: p.activity.color,
    activitySlug: p.activity.slug,
    area: p.area ? `${p.area.toLocaleString('ru-RU')} м²` : '',
    city: p.city ?? '',
    title: p.title,
    description: p.shortDescription ?? p.description.slice(0, 220),
    year: p.completedAt ? new Date(p.completedAt).getFullYear() : new Date(p.createdAt).getFullYear(),
    color: COLOR_FILTERS[i % COLOR_FILTERS.length],
    imageUrl: mediaUrl(p.mainImage),
    href: `/projects/${p.activity.slug}/${p.slug}`,
  }))
}
