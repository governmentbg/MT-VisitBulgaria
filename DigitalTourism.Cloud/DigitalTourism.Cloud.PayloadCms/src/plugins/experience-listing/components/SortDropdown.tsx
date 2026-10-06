'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { SimpleSelect } from '@/components/ui'
import type { SortOption } from '../types'

interface SortDropdownProps {
  value: SortOption
  onChange: (sort: SortOption) => void
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const t = useTranslations('experienceListing')

  const options = [
    { label: t('relevance'), value: 'relevance' },
    { label: t('titleAZ'), value: 'title_asc' },
    { label: t('titleZA'), value: 'title_desc' },
    { label: t('newest'), value: 'newest' },
  ]

  return (
    <SimpleSelect
      options={options}
      value={value}
      onChange={(val) => onChange(val as SortOption)}
      className="w-48"
    />
  )
}
