'use client'

import React, { useCallback, useState, useMemo } from 'react'
import { useField, useForm, useDocumentInfo, useTranslation } from '@payloadcms/ui'
import { TextInput } from '@payloadcms/ui'
import { FieldLabel } from '@payloadcms/ui'
import { useServerFunctions } from '@payloadcms/ui'
import type { SlugFieldClientProps } from 'payload'
import { transliterateSlug } from '../../utilities/slugTransliterate'
import './SlugField.scss'

export const SlugFieldWithPreview: React.FC<SlugFieldClientProps> = ({
  field,
  path,
  readOnly: readOnlyFromProps,
  useAsSlug,
}) => {
  const { label } = field
  const { t } = useTranslation()
  const { collectionSlug, globalSlug } = useDocumentInfo()
  const { slugify } = useServerFunctions()
  const { setValue, value } = useField({ path: path || field.name })
  const { getData, getDataByPath } = useForm()
  const [isLocked, setIsLocked] = useState(true)

  // Compute live transliteration preview from the source field
  const sourceValue = getDataByPath(useAsSlug ?? 'title') as string | undefined
  const preview = useMemo(() => {
    if (!sourceValue) return ''
    return transliterateSlug(sourceValue)
  }, [sourceValue])

  const handleGenerate = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      const valueToSlugify = getDataByPath(useAsSlug ?? 'title')
      const formattedSlug = await slugify({
        collectionSlug,
        data: getData(),
        globalSlug,
        path,
        valueToSlugify,
      })
      if (formattedSlug === null || formattedSlug === undefined) {
        setValue('')
        return
      }
      if (value !== formattedSlug) {
        setValue(formattedSlug)
      }
    },
    [collectionSlug, getData, getDataByPath, globalSlug, path, setValue, slugify, useAsSlug, value],
  )

  const toggleLock = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsLocked((prev) => !prev)
  }, [])

  const showPreview = isLocked && preview && preview !== value

  return (
    <div className="field-type slug-field-component slug-field-with-preview">
      <div className="label-wrapper">
        <FieldLabel htmlFor={`field-${path}`} label={label} />
        {!isLocked && (
          <button className="lock-button btn btn--style-none" onClick={handleGenerate} type="button">
            {t('authentication:generate')}
          </button>
        )}
        <button className="lock-button btn btn--style-none" onClick={toggleLock} type="button">
          {isLocked ? t('general:unlock') : t('general:lock')}
        </button>
      </div>
      <TextInput
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnlyFromProps || isLocked)}
        value={value as string}
      />
      {showPreview && (
        <div className="slug-preview">
          <span className="slug-preview__label">Preview:</span>{' '}
          <code className="slug-preview__value">{preview}</code>
        </div>
      )}
    </div>
  )
}
