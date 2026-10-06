'use client'

import React, { useCallback } from 'react'
import { useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/**
 * Custom admin field for the site password.
 * Renders a password input that is always empty — the admin types a new
 * password to change it. Shows an indicator when a password hash is stored.
 */
const SitePasswordField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path: path ?? field.name })
  const hashField = useFormFields(([fields]) => fields['sitePasswordHash'])
  const hasPassword = Boolean(hashField?.value)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    [setValue],
  )

  return (
    <div className="field-type text" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label" htmlFor={`field-${path ?? field.name}`}>
        {typeof field.label === 'string' ? field.label : 'Site Password'}
      </label>
      {hasPassword && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--theme-success-500)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '16px' }}>&#10003;</span>
          Password is set
        </div>
      )}
      <input
        id={`field-${path ?? field.name}`}
        type="password"
        autoComplete="new-password"
        placeholder={hasPassword ? 'Enter new password to change' : 'Enter a password'}
        value={value || ''}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid var(--theme-elevation-150)',
          borderRadius: '4px',
          background: 'var(--theme-input-bg)',
          color: 'var(--theme-text)',
          fontSize: '14px',
        }}
      />
      {field.admin?.description && (
        <div
          className="field-description"
          style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginTop: '6px' }}
        >
          {typeof field.admin.description === 'string' ? field.admin.description : null}
        </div>
      )}
    </div>
  )
}

export default SitePasswordField
