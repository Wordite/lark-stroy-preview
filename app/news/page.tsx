import Link from 'next/link'
import { Contact } from '@/widgets/Contact'
import { Separator } from '@/shared/Separator'
import { fetchNews } from '@/services/entities/news'
import { mediaUrl } from '@/services/mediaUrl'

export const revalidate = 15

export default async function NewsListPage() {
  const data = await fetchNews(1, 24)
  const items = data?.items ?? []

  return (
    <div className='mt-[170px]'>
      <h1 className='text-[45px] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em]'>
        Новости
      </h1>

      <Separator isFullscreen={true} className='mt-[40px]' />

      {items.length === 0 ? (
        <p className='mt-[40px] text-subtext text-[18px]'>Пока нет новостей.</p>
      ) : (
        <div className='mt-[40px] grid grid-cols-3 gap-[30px] pb-[60px]'>
          {items.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.slug}`}
              className='group block bg-card-bg hover:bg-black-light transition-colors duration-300'
            >
              <div className='aspect-[4/3] bg-muted overflow-hidden'>
                {n.image?.url ? (
                  <img
                    src={mediaUrl(n.image.url)}
                    alt={n.title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                  />
                ) : (
                  <div className='w-full h-full bg-black-light' />
                )}
              </div>
              <div className='p-[24px]'>
                {n.publishedAt && (
                  <p className='text-[14px] text-subtext'>
                    {new Date(n.publishedAt).toLocaleDateString('ru-RU')}
                  </p>
                )}
                <h3 className='text-[20px] font-semibold text-text-white mt-[8px] line-clamp-2'>
                  {n.title}
                </h3>
                {n.excerpt && (
                  <p className='text-[16px] text-subtext mt-[10px] line-clamp-3'>{n.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
