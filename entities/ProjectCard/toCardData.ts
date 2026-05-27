import type { StaticImageData } from 'next/image'
import type { Project } from '@/services/types'
import { mediaUrl } from '@/services/mediaUrl'

export interface IProjectCardData {
  id: string
  activity: string
  city: string
  name: string
  tags: string[]
  image?: StaticImageData | string
  href: string
}

export function projectToCardData(p: Project): IProjectCardData {
  const completedYear = p.completedAt ? new Date(p.completedAt).getFullYear().toString() : null
  const areaTag = p.area ? `${p.area.toLocaleString('ru-RU')} м²` : null
  const tagList = [areaTag, p.city, completedYear].filter(Boolean) as string[]
  return {
    id: p.id,
    activity: p.activity.title,
    city: p.city ?? '',
    name: p.title,
    tags: tagList,
    image: mediaUrl(p.mainImage),
    href: `/projects/${p.activity.slug}/${p.slug}`,
  }
}
