/**
 * Type definitions for admin panel translations
 */

export type LocalizedLabel = {
  en: string
  bg: string
}

export type CollectionLabels = {
  singular: LocalizedLabel
  plural: LocalizedLabel
}

export type LocalizedSelectOption = {
  label: LocalizedLabel
  value: string
}

export type GlobalLabels = {
  label: LocalizedLabel
}
