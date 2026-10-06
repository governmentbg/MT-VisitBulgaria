import type { LocalizedLabel } from '../types'

export const spacerBlockLabels: Record<string, LocalizedLabel> = {
  singular: { en: 'Spacer', bg: 'Разделител' },
  plural: { en: 'Spacers', bg: 'Разделители' },
  image: { en: 'Image', bg: 'Изображение' },
  alt: { en: 'Alt Text', bg: 'Алтернативен текст' },
  height: { en: 'Height', bg: 'Височина' },
  overlayText: { en: 'Overlay Text', bg: 'Текст върху изображението' },
  overlayTextValue: { en: 'Text', bg: 'Текст' },
  positionX: { en: 'X (%)', bg: 'X (%)' },
  positionY: { en: 'Y (%)', bg: 'Y (%)' },
  fadeIn: { en: 'Top Gradient', bg: 'Горен градиент' },
  fadeOut: { en: 'Bottom Gradient', bg: 'Долен градиент' },
  enabled: { en: 'Enabled', bg: 'Активен' },
  gradientColor: { en: 'Color', bg: 'Цвят' },
  gradientHeight: { en: 'Height (%)', bg: 'Височина (%)' },
  spacing: { en: 'Offset / Inset', bg: 'Отстояние' },
  offsetTop: { en: 'Top Offset (px)', bg: 'Горно отстояние (px)' },
  offsetBottom: { en: 'Bottom Offset (px)', bg: 'Долно отстояние (px)' },
  font: { en: 'Font', bg: 'Шрифт' },
  fontDisplay: { en: 'Display (handwritten)', bg: 'Декоративен (ръкописен)' },
  fontHeading: { en: 'Heading', bg: 'Заглавие' },
  fontSans: { en: 'Body', bg: 'Основен' },
}

export const spacerBlockDescriptions: Record<string, LocalizedLabel> = {
  alt: {
    en: 'Accessible description of the spacer image',
    bg: 'Описание на изображението за достъпност',
  },
  fadeIn: {
    en: 'Gradient fading from color to transparent at the top',
    bg: 'Градиент от цвят към прозрачно в горната част',
  },
  fadeOut: {
    en: 'Gradient fading from color to transparent at the bottom',
    bg: 'Градиент от цвят към прозрачно в долната част',
  },
  spacing: {
    en: 'Negative values create overlap with adjacent sections',
    bg: 'Отрицателни стойности създават припокриване със съседни секции',
  },
}
