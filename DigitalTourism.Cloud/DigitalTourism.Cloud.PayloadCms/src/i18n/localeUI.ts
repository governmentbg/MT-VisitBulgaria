import { GB, BG, DE, FR, RU } from 'country-flag-icons/react/3x2'
import type { LocaleCode } from './localization'

export const FLAG_COMPONENTS: Record<LocaleCode, React.ComponentType<{ className?: string; title?: string }>> = {
  en: GB,
  bg: BG,
  de: DE,
  fr: FR,
  ru: RU,
}

export const LOCALE_LABELS: Record<LocaleCode, string> = {
  en: 'English',
  bg: 'Bulgarian',
  de: 'German',
  fr: 'French',
  ru: 'Russian',
}

export const LOCALE_ORDER: LocaleCode[] = ['en', 'bg', 'de', 'fr', 'ru']
