'use client'

import React, { useCallback } from 'react'
import { SelectInput, useField, useTranslation, useFormProcessing, FieldLabel } from '@payloadcms/ui'
import type { ReactSelectOption } from '@payloadcms/ui'
import type { OptionObject, SelectFieldClientProps } from 'payload'
import { userRoleOptions } from '@/i18n/admin'

/**
 * Custom field component that shows a single-select dropdown
 * while persisting the value as an array (hasMany: true) in the database.
 */
export const SingleRoleSelect: React.FC<SelectFieldClientProps> = ({ field, path }) => {
  const { value, setValue } = useField<string[]>({ path })
  const processing = useFormProcessing()
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('bg') ? 'bg' : 'en'

  const options: OptionObject[] = userRoleOptions.map((opt) => ({
    label: opt.label[lang],
    value: opt.value,
  }))

  const currentValue = Array.isArray(value) && value.length > 0 ? value[0] : undefined

  const handleChange = useCallback(
    (option: ReactSelectOption | ReactSelectOption[]) => {
      if (!option) {
        setValue([])
        return
      }
      const selected = Array.isArray(option) ? option[0] : option
      setValue(selected?.value ? [selected.value as string] : [])
    },
    [setValue],
  )

  const label =
    typeof field.label === 'object' && field.label !== null
      ? (field.label as Record<string, string>)[lang] || (field.label as Record<string, string>).en
      : field.label

  const description =
    typeof field.admin?.description === 'object' && field.admin.description !== null
      ? (field.admin.description as Record<string, string>)[lang] ||
        (field.admin.description as Record<string, string>).en
      : field.admin?.description

  return (
    <div className="field-type select">
      <FieldLabel label={label} path={path} />
      <SelectInput
        path={path}
        name={field.name}
        options={options}
        value={currentValue}
        isClearable
        readOnly={processing}
        onChange={handleChange}
      />
      {description && (
        <div className="field-description">{description}</div>
      )}
    </div>
  )
}

export default SingleRoleSelect
