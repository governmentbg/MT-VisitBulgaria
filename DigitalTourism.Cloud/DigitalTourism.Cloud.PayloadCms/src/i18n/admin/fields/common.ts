import type { LocalizedLabel } from '../types'

/**
 * Common field labels used across multiple collections
 */
export const commonLabels: Record<string, LocalizedLabel> = {
  title: { en: 'Title', bg: 'Заглавие' },
  description: { en: 'Description', bg: 'Описание' },
  slug: { en: 'Slug', bg: 'Слъг' },
  publishedAt: { en: 'Published At', bg: 'Публикувано на' },
  categories: { en: 'Categories', bg: 'Категории' },
  heroImage: { en: 'Hero Image', bg: 'Главно изображение' },
  image: { en: 'Image', bg: 'Изображение' },
  caption: { en: 'Caption', bg: 'Надпис' },
  content: { en: 'Content', bg: 'Съдържание' },
  meta: { en: 'Meta', bg: 'Мета' },
  hero: { en: 'Hero', bg: 'Хиро' },
  authors: { en: 'Authors', bg: 'Автори' },
  populatedAuthors: { en: 'Populated Authors', bg: 'Попълнени автори' },
  tags: { en: 'Tags', bg: 'Етикети' },
}

/**
 * Common tab labels
 */
export const tabLabels: Record<string, LocalizedLabel> = {
  content: { en: 'Content', bg: 'Съдържание' },
  details: { en: 'Details', bg: 'Детайли' },
  location: { en: 'Location', bg: 'Местоположение' },
  visitorInfo: { en: 'Visitor Information', bg: 'Информация за посетители' },
  hero: { en: 'Hero', bg: 'Хиро' },
  meta: { en: 'Meta', bg: 'Мета' },
}

/**
 * Common group labels
 */
export const groupLabels: Record<string, LocalizedLabel> = {
  experiences: { en: 'Experiences', bg: 'Обекти' },
  content: { en: 'Content', bg: 'Съдържание' },
  settings: { en: 'Settings', bg: 'Настройки' },
}

/**
 * Common field descriptions
 */
export const commonDescriptions: Record<string, LocalizedLabel> = {
  coordinates: {
    en: 'Geographic coordinates for the experience location',
    bg: 'Географски координати за местоположението',
  },
  gallery: {
    en: 'Image gallery for the experience',
    bg: 'Галерия с изображения за преживяването',
  },
}
