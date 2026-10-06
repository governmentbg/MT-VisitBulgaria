'use client'

import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'
import { Link } from '@/i18n/routing'
import { CloseButton } from '../../primitives/CloseButton'

export interface CategoryItem {
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
}

export interface Category {
  label: string
  items: CategoryItem[]
}

export interface NavigationImage {
  src: string
  alt: string
  href?: string
}

export interface NavigationOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  categories?: Category[]
  images?: NavigationImage[]
  onClose?: () => void
  activeCategory?: string
  onCategoryChange?: (label: string) => void
  ref?: React.Ref<HTMLDivElement>
}

const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  categories = [],
  images = [],
  onClose,
  activeCategory,
  onCategoryChange,
  className,
  ref,
  ...props
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    activeCategory || categories[0]?.label || '',
  )

  const handleCategoryChange = (label: string) => {
    setSelectedCategory(label)
    onCategoryChange?.(label)
  }

  const currentCategory = categories.find((c) => c.label === selectedCategory)

  return (
    <div
      className={cn(
        'w-full rounded-b-2xl bg-white p-6 shadow-xl font-sans',
        className,
      )}
      ref={ref}
      {...props}
    >
      <div className="flex items-start justify-between">
        {/* Category tabs */}
        <div className="flex gap-1 border-b border-grey-100">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => handleCategoryChange(cat.label)}
              className={cn(
                'px-4 py-3 text-sm font-medium transition-colors',
                selectedCategory === cat.label
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-grey-500 hover:text-grey-700',
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {onClose && <CloseButton onClose={onClose} size="sm" />}
      </div>

      <div className="mt-6 flex gap-8">
        {/* Items list */}
        <div className="flex-1">
          {currentCategory && (
            <div className="grid grid-cols-2 gap-2">
              {currentCategory.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href ?? '#'}
                  onClick={item.onClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-grey-700 transition-colors hover:bg-grey-25"
                >
                  {item.icon && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-grey-25 text-grey-500 [&_svg]:h-4 [&_svg]:w-4">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Images grid */}
        {images.length > 0 && (
          <div className="grid w-80 shrink-0 grid-cols-2 gap-2">
            {images.slice(0, 4).map((img, i) => (
              <Link
                key={i}
                href={img.href ?? '#'}
                className="overflow-hidden rounded-lg"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="aspect-square h-full w-full object-cover transition-transform hover:scale-105"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { NavigationOverlay }
