'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { DateSelector } from './DateSelector'
import { Stack } from '../layout/Stack'
import { Label } from '../primitives/Label'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/DateSelector',
  component: DateSelector,
  parameters: { layout: 'padded', ...figmaDesign('1335:10940') },
  argTypes: {
    type: { control: 'select', options: ['date', 'single-date'] },
    disabled: { control: 'boolean' },
    locale: { control: 'select', options: ['en', 'bg', 'de', 'fr', 'ru'] },
  },
} satisfies Meta<typeof DateSelector>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

const InteractiveSingleDate = ({ locale, label, placeholder }: { locale: string; label?: string; placeholder?: string }) => {
  const [date, setDate] = useState<Date | null>(null)
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label ?? 'Date'}</Label>
      <DateSelector
        type="single-date"
        placeholder={placeholder ?? 'Select a date'}
        selectedDate={date}
        onDateChange={setDate}
        locale={locale}
      />
    </div>
  )
}

const InteractiveDateRange = ({ locale, label, placeholder }: { locale: string; label?: string; placeholder?: string }) => {
  const [start, setStart] = useState<Date | null>(null)
  const [end, setEnd] = useState<Date | null>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label ?? 'Date range'}</Label>
      <DateSelector
        type="date"
        placeholder={placeholder ?? 'Select dates'}
        startDate={start}
        endDate={end}
        onDateRangeChange={(s, e) => {
          setStart(s)
          setEnd(e)
        }}
        locale={locale}
      />
    </div>
  )
}

const PrefilledDateRange = ({ locale }: { locale: string }) => {
  const [start, setStart] = useState<Date | null>(new Date('2026-03-10'))
  const [end, setEnd] = useState<Date | null>(new Date('2026-03-31'))

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Pre-filled range</Label>
      <DateSelector
        type="date"
        startDate={start}
        endDate={end}
        onDateRangeChange={(s, e) => {
          setStart(s)
          setEnd(e)
        }}
        locale={locale}
      />
    </div>
  )
}

export const Showcase: Story = {
  args: { type: 'date' },
  render: () => (
    <Stack gap="2xl" className="max-w-md">
      <Stack gap="xs">
        <h2 className="text-h4 font-semibold">DateSelector</h2>
        <p className="text-body-md text-muted-foreground">
          Date range picker and single date selector.
        </p>
      </Stack>

      <Stack gap="xl">
        <Stack gap="sm">
          <SectionLabel>Single date</SectionLabel>
          <InteractiveSingleDate locale="en" />
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Date range</SectionLabel>
          <InteractiveDateRange locale="en" />
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Pre-filled range</SectionLabel>
          <PrefilledDateRange locale="en" />
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Disabled</SectionLabel>
          <div className="flex flex-col gap-1.5">
            <Label>Disabled</Label>
            <DateSelector
              type="date"
              placeholder="Disabled selector"
              disabled
            />
          </div>
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const Locales: Story = {
  args: { type: 'date' },
  render: () => (
    <Stack gap="2xl" className="max-w-md">
      <Stack gap="xs">
        <h2 className="text-h4 font-semibold">Locale Examples</h2>
        <p className="text-body-md text-muted-foreground">
          Calendar header and weekday names localized per locale.
        </p>
      </Stack>

      <Stack gap="xl">
        {([
          { locale: 'bg', label: 'Период', placeholder: 'Изберете дати' },
          { locale: 'en', label: 'Date range', placeholder: 'Select dates' },
          { locale: 'de', label: 'Zeitraum', placeholder: 'Daten auswählen' },
          { locale: 'fr', label: 'Période', placeholder: 'Sélectionner des dates' },
          { locale: 'ru', label: 'Период', placeholder: 'Выберите даты' },
        ] as const).map(({ locale, label, placeholder }) => (
          <Stack key={locale} gap="sm">
            <SectionLabel>{locale}</SectionLabel>
            <InteractiveDateRange locale={locale} label={label} placeholder={placeholder} />
          </Stack>
        ))}
      </Stack>
    </Stack>
  ),
}

export const Playground: Story = {
  args: {
    type: 'date',
    placeholder: 'Select date...',
  },
}
