import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Contact } from '@/widgets/Contact'
import { Separator } from '@/shared/Separator'
import { fetchNewsBySlug } from '@/services/entities/news'

export const revalidate = 15

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const news = await fetchNewsBySlug(slug)
  if (!news) notFound()

  return (
    <article className='mt-[170px]'>
      <Link
        href='/news'
        className='inline-block text-[16px] text-subtext hover:text-accent transition-colors duration-200'
      >
        ← Все новости
      </Link>

      <h1 className='mt-[20px] text-[45px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] max-w-[900px]'>
        {news.title}
      </h1>

      {news.publishedAt && (
        <p className='mt-[16px] text-[16px] text-subtext'>
          {new Date(news.publishedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      )}

      <Separator isFullscreen={true} className='mt-[30px]' />

      {news.image?.url && (
        <div className='mt-[30px] mb-[30px] w-screen -translate-x-(--container-offset) overflow-hidden max-h-[480px]'>
          <img src={news.image.url} alt={news.title} className='w-full max-h-[480px] object-cover' />
        </div>
      )}

      <div className='mt-[30px] max-w-[900px] text-[18px] text-text-white leading-[1.6em] whitespace-pre-wrap pb-[60px]'>
        {news.content}
      </div>

      <Contact isBorderTopDisabled={true} />
    </article>
  )
}
