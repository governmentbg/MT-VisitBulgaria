import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Button,
} from '@/components/ui'
import { searchExperiences } from '../actions'
import type { ExperienceSearchResult as SearchResult } from '@/lib/search'

// Simple debounce hook
function useDebounceValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

type Props = {
  onSelect: (experience: any) => void
  locale: string
}

import { useTranslations } from 'next-intl'

// Type labels are now handled via translations
// const typeLabels: Record<string, string> = { ... } removed

export function SearchDialog({ onSelect, locale }: Props) {
  const t = useTranslations('tripPlanner')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounceValue(query, 400)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const response = await searchExperiences({
          query: debouncedQuery,
          locale,
          perPage: 8,
        })
        setResults(response.hits)
      } catch (e) {
        console.error('Search error:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [debouncedQuery, locale])

  const handleSelect = (item: SearchResult) => {
    onSelect(item)
    setOpen(false)
    setQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full gap-2 h-11 bg-gradient-to-r from-primary/5 to-transparent border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-200 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary group-hover:scale-110 transition-transform"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="font-medium">{t('searchTitle')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden max-h-[85vh]">
        <DialogHeader className="px-5 pt-5 pb-4 bg-gradient-to-b from-slate-50 to-white border-b shrink-0">
          <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            {t('searchTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
              placeholder={t('searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-11 text-base bg-slate-50/50 border-slate-200 focus:bg-white focus:border-primary/30 transition-colors"
              autoFocus
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Results Area - Fixed height with scroll */}
          <div className="max-h-[400px] overflow-y-auto pr-1 -mr-1">
            {/* Loading State */}
            {loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <svg
                    className="animate-spin h-7 w-7 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">{t('searching')}</p>
              </div>
            )}

            {/* Empty State - Initial */}
            {!loading && query.length < 2 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mb-4 border border-slate-200/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">{t('startTyping')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('startTypingDesc')}</p>
              </div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <div className="space-y-3 pb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {t('resultsFound', { count: results.length })}
                </p>
                {results.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex gap-4 p-3 rounded-xl border border-slate-200/60 bg-white hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent hover:border-primary/30 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => handleSelect(item)}
                  >
                    {/* Image */}
                    <div className="shrink-0 w-24 h-20 rounded-lg overflow-hidden bg-slate-100 relative">
                      {item.heroImage?.url ? (
                        <img
                          src={item.heroImage.url}
                          alt={item.heroImage.alt || item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-semibold text-sm text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {t(`types.${item.type}` as any)}
                        </span>
                        {item.location?.city && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {item.location.city}
                          </span>
                        )}
                        {item.starRating !== undefined && item.starRating > 0 && (
                          <span className="text-xs text-amber-600 flex items-center gap-0.5 font-medium">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              stroke="none"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {item.starRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Add Button */}
                    <div className="shrink-0 flex items-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-9 p-0 rounded-full opacity-0 group-hover:opacity-100 bg-primary text-white hover:bg-primary/90 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M12 5v14" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results State */}
            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                    <path d="m8 8 6 6" />
                    <path d="m14 8-6 6" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-600">{t('noResults')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('tryDifferentTerm')}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
