'use client'

import React, { useState, useCallback } from 'react'
import { cn } from '@/components/ui'
import RichText from '@/components/RichText'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'

export interface HorizontalAccordionItem {
  number: string
  title: string
  body?: DefaultTypedEditorState | null
  image?: MediaType | number | null
}

export interface HorizontalAccordionProps {
  items: HorizontalAccordionItem[]
  className?: string
}

export const HorizontalAccordion: React.FC<HorizontalAccordionProps> = ({
  items,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  if (items.length === 0) return null

  return (
    <>
      {/* Desktop: horizontal accordion (md+) */}
      <div
        className={cn(
          'hidden overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm md:flex',
          className,
        )}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <React.Fragment key={index}>
              {/* Tab button — vertical label */}
              <button
                type="button"
                onClick={() => handleTabClick(index)}
                className={cn(
                  'relative flex flex-col items-center justify-between py-[60px] transition-all duration-300',
                  isActive
                    ? 'w-[100px] bg-primary-50'
                    : 'w-[96px] cursor-pointer bg-white hover:bg-grey-50',
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-0 h-full w-1 bg-primary" />
                )}

                {/* Number */}
                <p
                  className={cn(
                    'font-heading text-xl font-bold',
                    isActive ? 'text-primary' : 'text-heading',
                  )}
                >
                  {item.number}
                </p>

                {/* Rotated title at bottom */}
                <div className="flex items-center justify-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  <p
                    className={cn(
                      'font-heading text-xl font-bold whitespace-nowrap',
                      isActive ? 'text-primary' : 'text-heading',
                    )}
                  >
                    {item.title}
                  </p>
                </div>
              </button>

              {/* Separator */}
              {!isActive && index < items.length - 1 && (
                <div className="w-px bg-black/10" />
              )}

              {/* Content panel — only rendered for active tab */}
              {isActive && (
                <div className="flex flex-1 flex-col gap-5 overflow-hidden px-[60px] py-[140px]">
                  <h4 className="text-2xl font-medium leading-[1.3] text-heading">
                    {item.title}
                  </h4>
                  {item.body?.root?.children?.length ? (
                    <RichText
                      data={item.body}
                      enableGutter={false}
                      className="text-lg font-medium leading-[1.6] text-grey-500"
                    />
                  ) : null}
                  {item.image &&
                    typeof item.image !== 'number' && (
                      <div className="relative mt-4 flex-1 min-h-[300px] overflow-hidden rounded-2xl">
                        <Media
                          fill
                          imgClassName="object-cover"
                          resource={item.image}
                          usePayloadSizes
                          preferredSize="large"
                        />
                      </div>
                    )}
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Mobile: vertical accordion (<md) */}
      <div className={cn('flex flex-col gap-3 md:hidden', className)}>
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-black/10 bg-white"
            >
              <button
                type="button"
                onClick={() => handleTabClick(index)}
                className={cn(
                  'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors',
                  isActive ? 'bg-primary-50' : 'hover:bg-grey-50',
                )}
              >
                <span
                  className={cn(
                    'font-heading text-lg font-bold',
                    isActive ? 'text-primary' : 'text-heading',
                  )}
                >
                  {item.number}
                </span>
                <span
                  className={cn(
                    'font-heading text-lg font-bold',
                    isActive ? 'text-primary' : 'text-heading',
                  )}
                >
                  {item.title}
                </span>
              </button>

              {isActive && (
                <div className="flex flex-col gap-4 px-5 pb-5">
                  {item.body?.root?.children?.length ? (
                    <RichText
                      data={item.body}
                      enableGutter={false}
                      className="text-base font-medium leading-[1.6] text-grey-500"
                    />
                  ) : null}
                  {item.image && typeof item.image !== 'number' && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                      <Media
                        fill
                        imgClassName="object-cover"
                        resource={item.image}
                        usePayloadSizes
                        preferredSize="medium"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
