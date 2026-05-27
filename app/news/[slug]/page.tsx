import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import ArrowIcon from '@/assets/icons/arrow.svg'
import { Contact } from '@/widgets/Contact'
import { Separator } from '@/shared/Separator'
import { Markdown } from '@/shared/Markdown'
import { fetchNewsBySlug } from '@/services/entities/news'
import { mediaUrl } from '@/services/mediaUrl'
import { buildMeta } from '@/services/seo'

export const revalidate = 15

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const news = await fetchNewsBySlug(slug).catch(() => null)
  if (!news) return {}
  return buildMeta({
    title: news.title,
    description: news.excerpt || news.title,
    path: `/news/${news.slug}`,
    image: mediaUrl(news.image?.url) || undefined,
    type: 'article',
    publishedTime: news.publishedAt || undefined,
  })
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const news = await fetchNewsBySlug(slug)
  if (!news) notFound()

  return (
    <article className='mt-[10.625rem]'>
      <div className='flex items-start gap-[1.563rem] max-md:flex-col max-md:gap-[1rem]'>
        <Link
          href='/news'
          aria-label='Все новости'
          className='group w-[3.375rem] h-[3.375rem] bg-accent flex justify-center items-center cursor-pointer transition duration-300 ease-out hover:brightness-110 hover:-translate-x-[.25rem] shrink-0'
        >
          <ArrowIcon className='w-[1.5rem] h-[1.5rem] [&>path]:stroke-on-accent transition-transform duration-300 ease-out group-hover:-translate-x-[.188rem]' />
        </Link>
        <div className='flex-1'>
          <h1 className='text-[2.813rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] max-w-[56.25rem]'>
            {news.title}
          </h1>
          {news.publishedAt && (
            <p className='mt-[1rem] text-[1rem] text-subtext'>
              {new Date(news.publishedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>

      <Separator isFullscreen={true} className='mt-[2.5rem]' />

      {news.image?.url && (
        <div className='mt-[2rem] mb-[2rem] w-screen -translate-x-(--container-offset) overflow-hidden max-h-[30rem]'>
          <img src={mediaUrl(news.image.url)} alt={news.title} className='w-full max-h-[30rem] object-cover' />
        </div>
      )}

      <div className='mt-[2rem] max-w-[56.25rem] pb-[3.75rem]'>
        <Markdown content={news.content} />
      </div>

      <Contact />
    </article>
  )
}
