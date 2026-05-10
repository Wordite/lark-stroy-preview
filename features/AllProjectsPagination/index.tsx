'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Pagination } from '@/features/Pagination'

interface IAllProjectsPaginationProps {
  totalPages: number
  className?: string
}

const AllProjectsPagination = ({ totalPages, className }: IAllProjectsPaginationProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Math.max(1, Number(searchParams.get('page') ?? '1'))

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page <= 1) params.delete('page')
    else params.set('page', String(page))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  if (totalPages <= 1) return null

  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onChange={goToPage}
      className={className}
    />
  )
}

export { AllProjectsPagination }
