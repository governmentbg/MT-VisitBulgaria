import slugify from 'slugify'

/**
 * Cyrillic-to-Latin character mappings.
 *
 * Bulgarian uses the BGS (Bg official) transliteration standard.
 * Russian overrides are applied where the two languages differ.
 */
const CYRILLIC_MAP: Record<string, string> = {
  // Lowercase Bulgarian (BGS standard)
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'sht',
  ъ: 'a',
  ь: '',
  ю: 'yu',
  я: 'ya',
  // Uppercase Bulgarian
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Е: 'E',
  Ж: 'Zh',
  З: 'Z',
  И: 'I',
  Й: 'Y',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'Ts',
  Ч: 'Ch',
  Ш: 'Sh',
  Щ: 'Sht',
  Ъ: 'A',
  Ь: '',
  Ю: 'Yu',
  Я: 'Ya',
  // Russian-only characters (lowercase + uppercase)
  ы: 'y',
  Ы: 'Y',
  э: 'e',
  Э: 'E',
  ё: 'yo',
  Ё: 'Yo',
}

// Apply the character map globally once
slugify.extend(CYRILLIC_MAP)

/**
 * Transliterate a string to a URL-safe slug.
 * Handles Cyrillic (Bulgarian BGS, Russian), accented Latin, and other Unicode characters.
 */
export function transliterateSlug(value: string): string {
  return slugify(value, { lower: true, strict: true, trim: true })
}

/**
 * Server-side slugify function matching Payload's `Slugify` signature.
 * Used as `slugField({ slugify: payloadSlugify })`.
 */
export const payloadSlugify = ({
  valueToSlugify,
}: {
  data: unknown
  req: unknown
  valueToSlugify?: string
}): string | undefined => {
  if (!valueToSlugify) return undefined
  return transliterateSlug(valueToSlugify)
}
