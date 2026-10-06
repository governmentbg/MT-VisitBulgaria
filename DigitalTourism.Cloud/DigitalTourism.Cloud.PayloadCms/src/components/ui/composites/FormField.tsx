'use client'

import { cn } from '@/components/ui/theme/cn'
import { Label } from '../primitives/Label'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export interface FormFieldProps {
  name?: string
  label?: string
  required?: boolean
  description?: string
  error?: string
  useFormContext?: boolean
  className?: string
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  required,
  description,
  error: errorProp,
  useFormContext: shouldUseFormContext,
  className,
  children,
}) => {
  // Always call the hook (safe when no FormProvider — returns undefined cast)
  const ctx = useFormContext()
  const rhfError =
    shouldUseFormContext && name
      ? (() => {
          const fieldError = ctx?.formState?.errors?.[name]
          return typeof fieldError?.message === 'string' ? fieldError.message : undefined
        })()
      : undefined

  const error = errorProp ?? rhfError
  const hasError = !!error

  return (
    <div
      className={cn('group/field flex flex-col gap-1.5', className)}
      {...(hasError ? { 'data-error': '' } : {})}
    >
      {label && (
        <Label
          htmlFor={name}
          className="text-xs font-bold text-input-field-label font-sans"
        >
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

export { FormField }
