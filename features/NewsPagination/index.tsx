'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Pagination } from '@/features/Pagination'

interface INewsPaginationProps {
  totalPages: number
  currentPage: number
}

const NewsPagination = ({ totalPages, currentPage }: INewsPaginationProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const goToPage = (page: number) => {
    const next = new URLSearchParams(params.toString())
    if (page <= 1) next.delete('page')
    else next.set('page', String(page))
    const qs = next.toString()
    router.push(qs ? `/news?${qs}` : '/news')
  }

  if (totalPages <= 1) return null

  return <Pagination totalPages={totalPages} currentPage={currentPage} onChange={goToPage} />
}

export { NewsPagination }
