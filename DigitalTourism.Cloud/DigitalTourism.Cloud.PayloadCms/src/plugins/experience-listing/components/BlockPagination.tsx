'use client'

import React from 'react'
import {
  Pagination,
  PaginationPage,
  PaginationEllipsis,
  PaginationFirst,
  PaginationPrevious,
  PaginationNext,
  PaginationLast,
} from '@/components/ui/composites/Pagination'

interface BlockPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  buildPageUrl?: (page: number) => string
}

function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 7

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (currentPage > 3) {
    pages.push('ellipsis')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) {
    pages.push('ellipsis')
  }

  pages.push(totalPages)

  return pages
}

export const BlockPagination: React.FC<BlockPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  buildPageUrl,
}) => {
  if (totalPages <= 1) return null

  const handleClick = (page: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    onPageChange(page)
  }

  return (
    <Pagination className="mt-8 flex w-full justify-between md:justify-center">
      <div className="flex gap-1">
        <PaginationFirst
          href={buildPageUrl?.(1)}
          onClick={handleClick(1)}
          disabled={currentPage <= 1}
          className={currentPage <= 2 ? 'md:flex hidden' : undefined}
        />
        <PaginationPrevious
          href={buildPageUrl?.(currentPage - 1)}
          onClick={handleClick(currentPage - 1)}
          disabled={currentPage <= 1}
        />
      </div>

      {/* Desktop: page numbers + ellipsis */}
      {getPageNumbers(currentPage, totalPages).map((pageNum, idx) =>
        pageNum === 'ellipsis' ? (
          <PaginationEllipsis key={`ellipsis-${idx}`} className="hidden md:flex" />
        ) : (
          <PaginationPage
            key={pageNum}
            isActive={pageNum === currentPage}
            href={buildPageUrl?.(pageNum)}
            onClick={handleClick(pageNum)}
            aria-label={`Page ${pageNum}`}
            className="hidden md:flex"
          >
            {pageNum}
          </PaginationPage>
        ),
      )}

      {/* Mobile: "X of Y" */}
      <span className="flex md:hidden items-center text-sm font-medium text-muted-foreground">
        {currentPage} of {totalPages}
      </span>

      <PaginationNext
        href={buildPageUrl?.(currentPage + 1)}
        onClick={handleClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        prefetch
      />
      <PaginationLast
        href={buildPageUrl?.(totalPages)}
        onClick={handleClick(totalPages)}
        disabled={currentPage >= totalPages}
        className="hidden md:flex"
      />
    </Pagination>
  )
}
