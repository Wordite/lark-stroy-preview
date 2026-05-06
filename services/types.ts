// Shared domain types between frontend and backend

export interface Media {
  id: string
  url: string
}

export interface ProjectCategory {
  id: string
  name: string
  slug: string
  color: string
  iconSvg: string | null
  iconWidth: number
  iconHeight: number
  order: number
  description: string | null
  _count?: { projects: number }
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface ProjectImage {
  id: string
  mediaId: string
  url: string
  order: number
  isMain: boolean
}

export interface ProjectCharacteristic {
  key: string
  value: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string | null
  categoryId: string
  category: ProjectCategory
  area: number | null
  city: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  completedAt: string | null
  characteristics: ProjectCharacteristic[]
  published: boolean
  previousImageId: string | null
  previousImage: Media | null
  createdAt: string
  images: ProjectImage[]
  tags: Tag[]
  mainImage: string | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  items: T[]
  pagination: Pagination
}

export interface Activity {
  id: string
  title: string
  slug: string
  description: string
  iconSvg: string | null
  order: number
  services: Service[]
}

export interface Service {
  id: string
  activityId: string
  title: string
  slug: string
  description: string
  imageId: string | null
  image: Media | null
  order: number
}

export interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image: Media | null
  publishedAt: string | null
  createdAt: string
}

export type HomeBlockMode = 'manual' | 'latest' | 'latest_by_category'

export interface HomeBlockPublic {
  key: string
  title: string | null
  subtitle: string | null
  mode: HomeBlockMode
  categoryId: string | null
  newsId: string | null
  news: News | null
  config: Record<string, unknown>
  projects: Project[]
}

export type HomeContent = Record<string, HomeBlockPublic>

export interface MapPoint {
  id: string
  slug: string
  title: string
  city: string | null
  area: number | null
  latitude: number
  longitude: number
  mainImage: string | null
  category: {
    id: string
    slug: string
    name: string
    color: string
    iconSvg: string | null
    iconWidth: number
    iconHeight: number
  }
}

export interface ContactsPublic {
  settings: Record<string, string>
  socials: Array<{ id: string; name: string; href: string; iconSvg: string | null; order: number }>
}

export interface FooterColumn {
  id: string
  title: string
  order: number
  links: Array<{ id: string; label: string; href: string; order: number }>
}
