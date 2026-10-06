import { describe, it, expect } from 'vitest'
import { transliterateSlug, payloadSlugify } from '@/utilities/slugTransliterate'

describe('transliterateSlug', () => {
  describe('Bulgarian (BGS standard)', () => {
    it('transliterates basic Bulgarian text', () => {
      expect(transliterateSlug('Добре дошли')).toBe('dobre-doshli')
    })

    it('transliterates щ as sht (BGS)', () => {
      expect(transliterateSlug('площад')).toBe('ploshtad')
    })

    it('transliterates ъ as a (BGS)', () => {
      expect(transliterateSlug('България')).toBe('balgariya')
    })

    it('transliterates ж as zh', () => {
      expect(transliterateSlug('жена')).toBe('zhena')
    })

    it('transliterates ц as ts', () => {
      expect(transliterateSlug('цар')).toBe('tsar')
    })

    it('transliterates ч as ch', () => {
      expect(transliterateSlug('чист')).toBe('chist')
    })

    it('transliterates ш as sh', () => {
      expect(transliterateSlug('шест')).toBe('shest')
    })

    it('transliterates ю as yu', () => {
      expect(transliterateSlug('юни')).toBe('yuni')
    })

    it('transliterates я as ya', () => {
      expect(transliterateSlug('ябълка')).toBe('yabalka')
    })

    it('handles full Bulgarian sentence', () => {
      expect(transliterateSlug('Добре дошли в България')).toBe('dobre-doshli-v-balgariya')
    })
  })

  describe('Russian', () => {
    it('transliterates basic Russian text', () => {
      expect(transliterateSlug('Москва')).toBe('moskva')
    })

    it('transliterates ы as y', () => {
      expect(transliterateSlug('крыша')).toBe('krysha')
    })

    it('transliterates э as e', () => {
      expect(transliterateSlug('этаж')).toBe('etazh')
    })

    it('transliterates ё as yo', () => {
      expect(transliterateSlug('ёлка')).toBe('yolka')
    })

    it('handles full Russian sentence', () => {
      expect(transliterateSlug('Москва столица России')).toBe('moskva-stolitsa-rossii')
    })
  })

  describe('accented Latin characters', () => {
    it('handles French accents', () => {
      expect(transliterateSlug('Café résumé naïve')).toBe('cafe-resume-naive')
    })

    it('handles German umlauts and eszett', () => {
      expect(transliterateSlug('Straße über München')).toBe('strasse-uber-munchen')
    })

    it('handles acute and grave accents', () => {
      expect(transliterateSlug('à la crème brûlée')).toBe('a-la-creme-brulee')
    })

    it('handles cedilla', () => {
      expect(transliterateSlug('garçon façade')).toBe('garcon-facade')
    })
  })

  describe('English and general behavior', () => {
    it('converts to lowercase', () => {
      expect(transliterateSlug('Hello World')).toBe('hello-world')
    })

    it('replaces spaces with hyphens', () => {
      expect(transliterateSlug('some page title')).toBe('some-page-title')
    })

    it('strips special characters', () => {
      expect(transliterateSlug('Hello! World? #Test')).toBe('hello-world-test')
    })

    it('collapses multiple hyphens', () => {
      expect(transliterateSlug('hello   world')).toBe('hello-world')
    })

    it('trims leading and trailing whitespace', () => {
      expect(transliterateSlug('  hello world  ')).toBe('hello-world')
    })

    it('returns empty string for empty input', () => {
      expect(transliterateSlug('')).toBe('')
    })
  })

  describe('mixed scripts', () => {
    it('handles Cyrillic mixed with Latin', () => {
      expect(transliterateSlug('Добре дошли - Welcome')).toBe('dobre-doshli-welcome')
    })

    it('handles numbers with Cyrillic', () => {
      expect(transliterateSlug('Етаж 3 стая 42')).toBe('etazh-3-staya-42')
    })
  })
})

describe('payloadSlugify', () => {
  it('returns transliterated slug for Cyrillic input', () => {
    const result = payloadSlugify({
      data: {},
      req: {},
      valueToSlugify: 'Добре дошли',
    })
    expect(result).toBe('dobre-doshli')
  })

  it('returns transliterated slug for accented Latin input', () => {
    const result = payloadSlugify({
      data: {},
      req: {},
      valueToSlugify: 'Café résumé',
    })
    expect(result).toBe('cafe-resume')
  })

  it('returns undefined for empty input', () => {
    const result = payloadSlugify({
      data: {},
      req: {},
      valueToSlugify: '',
    })
    expect(result).toBeUndefined()
  })

  it('returns undefined when valueToSlugify is not provided', () => {
    const result = payloadSlugify({
      data: {},
      req: {},
    })
    expect(result).toBeUndefined()
  })
})
