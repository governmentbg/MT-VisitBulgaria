import { Link } from '@/i18n/routing'
import { ChevronRight, Home } from 'lucide-react'
import React from 'react'
import type { Page } from '@/payload-types'

export type BreadcrumbItem = {
  doc?: (number | null) | Page
  url?: string | null
  label?: string | null
  id?: string | null
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[] | null
  className?: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  // Filter out breadcrumb items with empty labels (incomplete locale translations)
  const validItems = items?.filter((item) => item.label) ?? []

  if (validItems.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {validItems.map((item, index) => {
          const isLast = index === validItems.length - 1

          return (
            <li key={item.id || index} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              {isLast || !item.url ? (
                <span className={isLast ? 'text-foreground font-medium' : ''}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
