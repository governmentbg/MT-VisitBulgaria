'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'

/**
 * Parse a stat value string into its numeric and non-numeric parts.
 * Locale determines whether comma is decimal or thousands separator.
 *
 * bg: comma = decimal, space = thousands  ("60 000", "8,3 млн")
 * en: dot = decimal, comma = thousands    ("60,000", "8.3 mln")
 */
export function parseStatValue(
  value: string,
  locale: string,
): {
  number: number
  prefix: string
  suffix: string
  decimals: number
} | null {
  const match = value.match(/^([^\d]*?)([\d\s,.]+)(.*)$/)
  if (!match) return null

  const prefix = match[1]
  const rawNumber = match[2].trim()
  const suffix = match[3]

  const cleaned = locale === 'bg'
    ? rawNumber.replace(/\s/g, '').replace(',', '.')
    : rawNumber.replace(/[\s,]/g, '')

  const decimalMatch = cleaned.match(/\.(\d+)$/)
  const decimals = decimalMatch ? decimalMatch[1].length : 0

  const parsed = parseFloat(cleaned)
  if (isNaN(parsed)) return null

  return { number: parsed, prefix, suffix, decimals }
}

export function formatNumber(n: number, decimals: number, locale: string): string {
  if (decimals === 0) {
    const rounded = Math.round(n)
    if (locale === 'bg') {
      // Space as thousands separator
      return rounded
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
    // Comma as thousands separator
    return rounded.toLocaleString('en-US')
  }
  const fixed = n.toFixed(decimals)
  if (locale === 'bg') {
    return fixed.replace('.', ',')
  }
  return fixed
}

export function useCountUp(target: number, duration: number = 2800) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const startAnimation = useCallback(() => {
    if (started) return
    setStarted(true)
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * target)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [target, duration, started])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [startAnimation])

  return { count, ref }
}

export function useAnimatedValue(value: string): {
  displayValue: string
  ref: React.RefObject<HTMLDivElement | null>
} {
  const locale = useLocale()
  const parsed = parseStatValue(value, locale)
  const { count, ref } = useCountUp(parsed?.number ?? 0)

  const displayValue = parsed
    ? `${parsed.prefix}${formatNumber(count, parsed.decimals, locale)}${parsed.suffix}`
    : value

  return { displayValue, ref }
}
