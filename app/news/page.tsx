import Link from 'next/link'
import { Contact } from '@/widgets/Contact'
import { Separator } from '@/shared/Separator'
import { EmptyState } from '@/shared/EmptyState'
import { NewsPagination } from '@/features/NewsPagination'
import { fetchNews } from '@/services/entities/news'
import { mediaUrl } from '@/services/mediaUrl'

export const revalidate = 15

const PAGE_SIZE = 12

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page ?? '1'))
  const data = await fetchNews(page, PAGE_SIZE)
  const items = data?.items ?? []
  const totalPages = data?.pagination.totalPages ?? 1

  return (
    <div className='mt-[10.625rem]'>
      <h1 className='w-[18.75rem] text-[2.813rem] font-semibold text-transparent bg-clip-text bg-(image:--color-gradient-white-gray-horizontal) leading-[1.2em] mb-[2.5rem]'>
        Новости
      </h1>

      {items.length === 0 ? (
        <>
          <Separator isFullscreen={true} className='relative z-[1000]' />
          <EmptyState message='Пока нет новостей.' />
          <Separator isFullscreen={true} className='relative z-[1000]' />
        </>
      ) : (
        <>
          <Separator isFullscreen={true} className='relative z-[1000]' />
          <div className='grid grid-cols-3 max-md:flex max-md:flex-col relative'>
            {items.map((n, i) => {
              const colInRow = i % 3
              const isFirstCol = colInRow === 0
              const isLastCol = colInRow === 2
              const hasRight = !isLastCol
              const isNewRowStart = i >= 3 && isFirstCol
              return (
                <div key={n.id} className='max-md:contents'>
                  {i > 0 && <Separator isFullscreen={true} className='hidden max-md:block' />}
                  <div
                    className={`relative ${hasRight ? 'border-r max-md:border-r-0 border-light-gray-tranpsparent-40' : ''}`}
                  >
                  {isNewRowStart && (
                    <div
                      className='absolute top-0 w-screen h-px bg-light-gray-tranpsparent-40 -translate-y-px z-[1] pointer-events-none max-md:hidden'
                      style={{ left: 'calc(-1 * var(--container-offset))' }}
                    />
                  )}
                  <Link
                    href={`/news/${n.slug}`}
                    className={`group block relative py-[1.688rem] px-[2.188rem] max-md:px-0 h-full transition-colors duration-300 ${
                      !isFirstCol && !isLastCol ? 'hover:bg-black-light' : ''
                    }`}
                  >
                    {isFirstCol && (
                      <div className='max-md:hidden w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 right-0 -z-10' />
                    )}
                    {isLastCol && (
                      <div className='max-md:hidden w-screen h-full group-hover:bg-black-light transition-colors duration-300 absolute inset-y-0 left-0 -z-10' />
                    )}
                    <div className='relative'>
                      <div className='overflow-hidden h-[11.625rem] max-md:h-[16rem] relative'>
                        {n.image?.url ? (
                          <img
                            src={mediaUrl(n.image.url)}
                            alt={n.title}
                            className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]'
                          />
                        ) : (
                          <div className='w-full h-full bg-black-light' />
                        )}
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                          <span className='px-[1.125rem] py-[.5rem] border border-accent text-accent text-[.813rem] font-medium uppercase tracking-wider group-hover:translate-y-0 translate-y-[.625rem] transition-transform duration-300 ease-out'>
                            Подробнее
                          </span>
                        </div>
                      </div>
                      {n.publishedAt && (
                        <p className='text-[1rem] text-subtext mt-[1.875rem]'>
                          {new Date(n.publishedAt).toLocaleDateString('ru-RU')}
                        </p>
                      )}
                      <h3 className='text-[1.125rem] font-medium text-text-white mt-[.625rem] line-clamp-2'>
                        {n.title}
                      </h3>
                      {n.excerpt && (
                        <p className='text-[1rem] text-subtext mt-[.625rem] line-clamp-3'>{n.excerpt}</p>
                      )}
                    </div>
                  </Link>
                  </div>
                </div>
              )
            })}
          </div>
          <Separator isFullscreen={true} className='relative z-[1000]' />
          <NewsPagination totalPages={totalPages} currentPage={page} />
        </>
      )}

      <Contact isBorderTopDisabled={true} />
    </div>
  )
}
