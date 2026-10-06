import { revalidatePath } from 'next/cache'
import { LOCALE_CODES } from '@/i18n/localization'

/**
 * Revalidates a path for all configured locales.
 * Since frontend routes are prefixed with [locale], a single path like `/about`
 * needs to be revalidated as `/en/about`, `/bg/about`, etc.
 */
export const revalidatePathForAllLocales = (path: string) => {
  for (const locale of LOCALE_CODES) {
    revalidatePath(`/${locale}${path === '/' ? '' : path}`)
  }
}
