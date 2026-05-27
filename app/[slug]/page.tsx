import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Contact } from '@/widgets/Contact'
import { Separator } from '@/shared/Separator'
import { Markdown } from '@/shared/Markdown'
import { fetchPageBySlug } from '@/services/entities/pages'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

function excerpt(md: string, max = 160): string {
  const plain = md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return plain.length > max ? `${plain.slice(0, max - 1)}…` : plain
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchPageBySlug(slug).catch(() => null)
  if (!page) return {}
  return buildMeta({
    title: page.title,
    description: excerpt(page.content),
    path: `/${page.slug}`,
  })
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = await fetchPageBySlug(slug).catch(() => null)
  if (!page) notFound()

  return (
    <article className='mt-[10.625rem]'>
      <h1 className='text-[2.813rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] max-w-[56.25rem]'>
        {page.title}
      </h1>

      <Separator isFullscreen={true} className='mt-[2.5rem]' />

      <div className='mt-[2rem] max-w-[56.25rem] pb-[3.75rem]'>
        <Markdown content={page.content} />
      </div>

      <Contact />
    </article>
  )
}
