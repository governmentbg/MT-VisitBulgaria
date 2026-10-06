'use client'

import React from 'react'
import {
  Pagination as PaginationNav,
  PaginationPage,
  PaginationEllipsis,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
  cn,
} from '@/components/ui'

const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, 100)
}

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
  basePath?: string
}> = (props) => {
  const { className, page, totalPages, basePath = '/' } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  const prevPageRoute = hasPrevPage ? `${basePath}/page/${page - 1}` : undefined
  const nextPageRoute = hasNextPage ? `${basePath}/page/${page + 1}` : undefined
  const firstPageRoute = `${basePath}/page/1`
  const lastPageRoute = `${basePath}/page/${totalPages}`

  return (
    <div className={cn('my-12', className)}>
      <PaginationNav className="flex w-full justify-between md:justify-center">
        <div className="flex gap-1">
          <PaginationFirst href={firstPageRoute} disabled={!hasPrevPage} onClick={scrollToTop} className={cn(page <= 2 && 'md:flex hidden')} />
          <PaginationPrevious href={prevPageRoute} disabled={!hasPrevPage} onClick={scrollToTop} />
        </div>

        {/* Desktop: page numbers + ellipsis */}
        {hasExtraPrevPages && <PaginationEllipsis className="hidden md:flex" />}
        {hasPrevPage && prevPageRoute && (
          <PaginationPage href={prevPageRoute} onClick={scrollToTop} className="hidden md:flex">{page - 1}</PaginationPage>
        )}
        <PaginationPage isActive className="hidden md:flex">{page}</PaginationPage>
        {hasNextPage && nextPageRoute && (
          <PaginationPage href={nextPageRoute} onClick={scrollToTop} prefetch className="hidden md:flex">{page + 1}</PaginationPage>
        )}
        {hasExtraNextPages && <PaginationEllipsis className="hidden md:flex" />}

        {/* Mobile: "X of Y" */}
        <span className="flex md:hidden items-center text-sm font-medium text-muted-foreground">
          {page} of {totalPages}
        </span>

        <div className="flex gap-1">
          <PaginationNext href={nextPageRoute} disabled={!hasNextPage} onClick={scrollToTop} prefetch />
          <PaginationLast href={lastPageRoute} disabled={!hasNextPage} onClick={scrollToTop} className="hidden md:flex" />
        </div>
      </PaginationNav>
    </div>
  )
}
