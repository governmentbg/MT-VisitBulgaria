'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import { cn, Button, Input, Container } from '@/components/ui'
import { SpriteIcon } from '@/components/ui/SpriteIcon'

const bgClasses = {
  primary: 'bg-primary',
  teal: 'bg-[#0D9488]',
  dark: 'bg-grey-900',
} as const

interface EventSearchClientProps {
  heading: string
  whatPlaceholder: string
  wherePlaceholder: string
  whenPlaceholder: string
  searchButtonLabel: string
  searchUrl: string
  backgroundColor: string
}

export const EventSearchClient: React.FC<EventSearchClientProps> = ({
  heading,
  whatPlaceholder,
  wherePlaceholder,
  whenPlaceholder,
  searchButtonLabel,
  searchUrl,
  backgroundColor,
}) => {
  const router = useRouter()
  const [what, setWhat] = useState('')
  const [where, setWhere] = useState('')
  const [when, setWhen] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (what) params.set('q', what)
    if (where) params.set('where', where)
    if (when) params.set('when', when)

    const queryString = params.toString()
    router.push(queryString ? `${searchUrl}?${queryString}` : searchUrl)
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden py-16 md:py-24',
        bgClasses[backgroundColor as keyof typeof bgClasses] || bgClasses.teal,
      )}
    >
      {/* Decorative wave shapes */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="absolute -left-20 -top-20 h-[400px] w-[400px]" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="white" />
        </svg>
        <svg className="absolute -bottom-20 -right-20 h-[300px] w-[300px]" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="130" fill="white" />
        </svg>
      </div>

      <Container className="relative z-10">
        <h2 className="mb-10 text-center font-heading text-2xl font-bold text-white md:text-3xl lg:text-4xl">
          {heading}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-lg md:flex-row md:items-end md:gap-3 md:rounded-full md:p-2"
        >
          <div className="flex-1">
            <Input
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              placeholder={whatPlaceholder}
              leftIcon={<SpriteIcon name="search" />}
              className="border-0 shadow-none"
            />
          </div>
          <div className="hidden h-8 w-px bg-grey-100 md:block" />
          <div className="flex-1">
            <Input
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder={wherePlaceholder}
              className="border-0 shadow-none"
            />
          </div>
          <div className="hidden h-8 w-px bg-grey-100 md:block" />
          <div className="flex-1">
            <Input
              type="date"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder={whenPlaceholder}
              className="border-0 shadow-none"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={null}
            className="md:px-10"
          >
            {searchButtonLabel}
          </Button>
        </form>
      </Container>
    </div>
  )
}
