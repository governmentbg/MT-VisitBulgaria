'use client'

import { cn } from '@/components/ui/theme/cn'
import {
  CalendarLtrRegular,
  DismissRegular,
} from '@/components/ui/icons'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import * as React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './ds-calendar.scss'
import { bg } from 'date-fns/locale/bg'
import { de } from 'date-fns/locale/de'
import { fr } from 'date-fns/locale/fr'
import { ru } from 'date-fns/locale/ru'
import { enUS } from 'date-fns/locale/en-US'
import { useLocale } from 'next-intl'

registerLocale('bg', bg)
registerLocale('de', de)
registerLocale('fr', fr)
registerLocale('ru', ru)
registerLocale('en', enUS)

function useSafeLocale(): string {
  try {
    return useLocale()
  } catch {
    return 'en'
  }
}

export interface DateSelectorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  type: 'date' | 'single-date'
  placeholder?: string
  disabled?: boolean
  locale?: string
  /** Single date mode */
  selectedDate?: Date | null
  onDateChange?: (date: Date | null) => void
  /** Date range mode */
  startDate?: Date | null
  endDate?: Date | null
  onDateRangeChange?: (start: Date | null, end: Date | null) => void
  confirmLabel?: string
  cancelLabel?: string
  ref?: React.Ref<HTMLDivElement>
}

const DateSelector: React.FC<DateSelectorProps> = ({
  type,
  placeholder,
  disabled = false,
  locale: localeProp,
  selectedDate: selectedDateProp,
  onDateChange,
  startDate: startDateProp,
  endDate: endDateProp,
  onDateRangeChange,
  confirmLabel = 'Избери',
  cancelLabel = 'Затвори',
  className,
  ref,
  ...props
}) => {
  const intlLocale = useSafeLocale()
  const locale = localeProp ?? intlLocale

  const isRange = type === 'date'

  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Pending date range (while calendar is open, before confirm)
  const [pendingRange, setPendingRange] = React.useState<[Date | null, Date | null]>([
    startDateProp ?? null,
    endDateProp ?? null,
  ])

  // Pending single date
  const [pendingSingle, setPendingSingle] = React.useState<Date | null>(selectedDateProp ?? null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = React.useCallback(
    (d: Date) => d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }),
    [locale],
  )

  const dateDisplayText = React.useMemo(() => {
    if (isRange) {
      if (startDateProp && endDateProp) {
        return `${formatDate(startDateProp)} – ${formatDate(endDateProp)}`
      }
      if (startDateProp) {
        return formatDate(startDateProp)
      }
    } else if (selectedDateProp) {
      return formatDate(selectedDateProp)
    }
    return null
  }, [isRange, startDateProp, endDateProp, selectedDateProp, formatDate])

  const handleToggle = () => {
    if (!open) {
      if (isRange) {
        setPendingRange([startDateProp ?? null, endDateProp ?? null])
      } else {
        setPendingSingle(selectedDateProp ?? null)
      }
    }
    setOpen(!open)
  }

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setPendingRange(dates)
  }

  const handleSingleDateChange = (date: Date | null) => {
    setPendingSingle(date)
  }

  const handleConfirm = () => {
    if (isRange) {
      onDateRangeChange?.(pendingRange[0], pendingRange[1])
    } else {
      onDateChange?.(pendingSingle)
    }
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const handleClearDates = () => {
    if (isRange) {
      onDateRangeChange?.(null, null)
      setPendingRange([null, null])
    } else {
      onDateChange?.(null)
      setPendingSingle(null)
    }
  }

  const hasValue = isRange
    ? !!(startDateProp || endDateProp)
    : !!selectedDateProp

  const formatMonthYear = React.useCallback(
    (date: Date) => {
      const text = date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
      return text.charAt(0).toUpperCase() + text.slice(1)
    },
    [locale],
  )

  return (
    <div ref={ref} {...props}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'flex w-full items-center gap-2 rounded-xl border border-input-field-border bg-background p-4 text-sm font-medium font-sans transition-colors',
            'hover:border-grey-300 focus:outline-none focus:shadow-[0px_0px_4px_1px] focus:shadow-primary focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        >
          <CalendarLtrRegular className="h-4 w-4 shrink-0 text-grey-400" />
          <span
            className={cn('flex-1 text-left', !dateDisplayText && 'text-input-field-placeholder')}
          >
            {dateDisplayText || placeholder || 'Select date'}
          </span>
          {hasValue ? (
            <DismissRegular
              className="h-4 w-4 shrink-0 text-grey-400 hover:text-grey-600"
              onClick={(e) => {
                e.stopPropagation()
                handleClearDates()
              }}
            />
          ) : (
            <CalendarLtrRegular className="h-4 w-4 shrink-0 text-grey-400 opacity-0 pointer-events-none" />
          )}
        </button>

        {/* Date picker calendar */}
        {open && (
          <div className="absolute top-full left-0 z-50 mt-1 w-full">
            <DatePicker
              selected={isRange ? pendingRange[0] : pendingSingle}
              {...(isRange
                ? {
                    selectsRange: true as const,
                    startDate: pendingRange[0],
                    endDate: pendingRange[1],
                    onChange: handleDateChange,
                  }
                : {
                    onChange: handleSingleDateChange,
                  })}
              inline
              locale={locale}
              calendarClassName="ds-calendar"
              formatWeekDay={(day) => day.slice(0, 2)}
              renderCustomHeader={({
                date,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
              }) => (
                <div className="ds-calendar-header">
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="ds-calendar-nav"
                  >
                    <SpriteIcon name="chevron-left" className="h-4 w-4" />
                  </button>
                  <span className="ds-calendar-month">{formatMonthYear(date)}</span>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="ds-calendar-nav"
                  >
                    <SpriteIcon name="chevron-right" className="h-4 w-4" />
                  </button>
                </div>
              )}
            >
              <div className="ds-calendar-footer">
                <button type="button" onClick={handleCancel} className="ds-calendar-btn-cancel">
                  {cancelLabel}
                </button>
                <button type="button" onClick={handleConfirm} className="ds-calendar-btn-confirm">
                  {confirmLabel}
                </button>
              </div>
            </DatePicker>
          </div>
        )}
      </div>
    </div>
  )
}

export { DateSelector }
