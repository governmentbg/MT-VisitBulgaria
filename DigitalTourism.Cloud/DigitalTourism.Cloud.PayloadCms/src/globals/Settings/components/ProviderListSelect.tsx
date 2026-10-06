'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField, useWatchForm, SelectInput, FieldLabel } from '@payloadcms/ui'
import type { SelectFieldClientProps } from 'payload'

import type { ListOption } from '@/services/newsletter/types'

/**
 * Custom field component that dynamically fetches lists/audiences/groups
 * from the selected newsletter provider API, based on the entered API key.
 *
 * Props (passed via field.admin.custom):
 * - providerName: 'mailchimp' | 'brevo' | 'mailerlite'
 * - apiKeyFieldName: the sibling field name that holds the API key
 * - emptyLabel: text to show when no options loaded yet
 */
export const ProviderListSelect: React.FC<SelectFieldClientProps> = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path })
  const { getDataByPath } = useWatchForm()

  const custom = (field.admin?.custom ?? {}) as Record<string, string>
  const providerName = custom.providerName || ''
  const apiKeyFieldName = custom.apiKeyFieldName || ''
  const apiKeyValue = getDataByPath(apiKeyFieldName) as string | undefined

  const [options, setOptions] = useState<ListOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiKeyValue || !providerName) {
      setOptions([])
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/newsletter/provider-lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: providerName, apiKey: apiKeyValue }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        if (data.success) {
          setOptions(data.options)
        } else {
          setError(data.error || 'Failed to load lists')
          setOptions([])
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message || 'Request failed')
        setOptions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [apiKeyValue, providerName])

  const handleChange = useCallback(
    (option: any) => {
      if (!option) {
        setValue('')
        return
      }
      const selected = Array.isArray(option) ? option[0] : option
      setValue(selected?.value ?? '')
    },
    [setValue],
  )

  const label = typeof field.label === 'string' ? field.label : (field.label as any)?.en || field.name

  const selectOptions = options.map((opt) => ({
    label: opt.label,
    value: opt.value,
  }))

  return (
    <div className="field-type select" style={{ marginBottom: '24px' }}>
      <FieldLabel label={label} path={path} />
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 0', color: 'var(--theme-elevation-500)' }}>
          <span
            style={{
              width: 16,
              height: 16,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'provider-list-spin 0.6s linear infinite',
            }}
          />
          <span style={{ fontSize: '13px' }}>Loading lists from {providerName}...</span>
          <style>{`@keyframes provider-list-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : !apiKeyValue ? (
        <div style={{ padding: '10px 0', fontSize: '13px', color: 'var(--theme-elevation-400)' }}>
          Enter an API key above to load available lists.
        </div>
      ) : error ? (
        <div style={{ padding: '10px 0', fontSize: '13px', color: 'var(--theme-error-500, #e11d48)' }}>
          {error}
        </div>
      ) : (
        <SelectInput
          path={path}
          name={field.name}
          options={selectOptions}
          value={value || ''}
          onChange={handleChange}
          isClearable
        />
      )}
      {field.admin?.description && (
        <div className="field-description" style={{ marginTop: '6px', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
          {typeof field.admin.description === 'string'
            ? field.admin.description
            : (field.admin.description as any)?.en || ''}
        </div>
      )}
    </div>
  )
}
