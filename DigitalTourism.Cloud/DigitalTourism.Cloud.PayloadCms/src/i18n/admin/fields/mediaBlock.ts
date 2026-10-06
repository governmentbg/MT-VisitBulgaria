import type { LocalizedLabel, LocalizedSelectOption } from '../types'

export const mediaBlockLabels: Record<string, LocalizedLabel> = {
  mediaType: { en: 'Media Type', bg: 'Тип медия' },
  media: { en: 'Image', bg: 'Изображение' },
  videoSource: { en: 'Video Source', bg: 'Видео източник' },
  sourceType: { en: 'Source Type', bg: 'Тип на източника' },
  videoFile: { en: 'Video File', bg: 'Видео файл' },
  videoUrl: { en: 'Video URL', bg: 'Видео URL' },
  embedUrl: { en: 'Embed URL', bg: 'Embed URL' },
  captions: { en: 'Captions', bg: 'Субтитри' },
  startTime: { en: 'Start (s)', bg: 'Начало (с)' },
  endTime: { en: 'End (s)', bg: 'Край (с)' },
  videoOptions: { en: 'Video Options', bg: 'Видео настройки' },
  autoPlay: { en: 'Auto Play', bg: 'Автоматично пускане' },
  muted: { en: 'Muted', bg: 'Без звук' },
  loop: { en: 'Loop', bg: 'Повторение' },
  showControls: { en: 'Show Controls', bg: 'Покажи контроли' },
  poster: { en: 'Poster Image', bg: 'Начална снимка' },
  style: { en: 'Style', bg: 'Стил' },
  fontSize: { en: 'Size', bg: 'Размер' },
  fontFamily: { en: 'Font', bg: 'Шрифт' },
  fontWeight: { en: 'Weight', bg: 'Дебелина' },
  textColor: { en: 'Color', bg: 'Цвят' },
  verticalPosition: { en: 'Vertical', bg: 'Вертикално' },
  horizontalAlignment: { en: 'Horizontal', bg: 'Хоризонтално' },
  background: { en: 'Background', bg: 'Фон' },
  captionWidth: { en: 'Width', bg: 'Ширина' },
  textShadow: { en: 'Shadow', bg: 'Сянка' },
  animation: { en: 'Animation', bg: 'Анимация' },
  manualX: { en: 'X (%)', bg: 'X (%)' },
  manualY: { en: 'Y (%)', bg: 'Y (%)' },
  altText: { en: 'Alt Text', bg: 'Алтернативен текст' },
  caption: { en: 'Caption', bg: 'Надпис' },
  layout: { en: 'Layout', bg: 'Оформление' },
  blockBackground: { en: 'Background', bg: 'Фон' },
  heading: { en: 'Heading', bg: 'Заглавие' },
  description: { en: 'Description', bg: 'Описание' },
  textAlignment: { en: 'Text Alignment', bg: 'Подравняване на текста' },
  enableParallax: { en: 'Parallax Effect', bg: 'Паралакс ефект' },
  imageHeight: { en: 'Image Height', bg: 'Височина на изображението' },
}

export const mediaBlockDescriptions: Record<string, LocalizedLabel> = {
  embedUrl: {
    en: 'YouTube or Vimeo URL',
    bg: 'YouTube или Vimeo URL',
  },
  videoUrl: {
    en: 'Direct link to a video file (MP4, WebM)',
    bg: 'Директна връзка към видео файл (MP4, WebM)',
  },
  manualXY: {
    en: 'Overrides preset position when set',
    bg: 'Замества позицията при попълване',
  },
  muted: {
    en: 'Required for autoplay in most browsers',
    bg: 'Необходимо за автоматично пускане в повечето браузъри',
  },
  poster: {
    en: 'Shown before the video plays',
    bg: 'Показва се преди пускане на видеото',
  },
}

export const mediaTypeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Image', bg: 'Изображение' }, value: 'image' },
  { label: { en: 'Video', bg: 'Видео' }, value: 'video' },
]

export const videoSourceTypeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Upload', bg: 'Качване' }, value: 'upload' },
  { label: { en: 'URL', bg: 'URL' }, value: 'url' },
  { label: { en: 'Embed (YouTube/Vimeo)', bg: 'Embed (YouTube/Vimeo)' }, value: 'embed' },
]

export const fontSizeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Small', bg: 'Малък' }, value: 'sm' },
  { label: { en: 'Medium', bg: 'Среден' }, value: 'md' },
  { label: { en: 'Large', bg: 'Голям' }, value: 'lg' },
  { label: { en: 'XL', bg: 'XL' }, value: 'xl' },
  { label: { en: '2XL', bg: '2XL' }, value: '2xl' },
  { label: { en: '3XL', bg: '3XL' }, value: '3xl' },
]

export const fontFamilyOptions: LocalizedSelectOption[] = [
  { label: { en: 'Sans (Montserrat)', bg: 'Sans (Montserrat)' }, value: 'sans' },
  { label: { en: 'Heading (Montserrat Alt)', bg: 'Заглавие (Montserrat Alt)' }, value: 'heading' },
  { label: { en: 'Display', bg: 'Display' }, value: 'display' },
  { label: { en: 'Mono (Geist)', bg: 'Mono (Geist)' }, value: 'mono' },
]

export const fontWeightOptions: LocalizedSelectOption[] = [
  { label: { en: 'Thin', bg: 'Тънко' }, value: 'thin' },
  { label: { en: 'Normal', bg: 'Нормално' }, value: 'normal' },
  { label: { en: 'Bold', bg: 'Удебелено' }, value: 'bold' },
  { label: { en: 'Black', bg: 'Черно' }, value: 'black' },
]

export const textColorOptions: LocalizedSelectOption[] = [
  { label: { en: 'White', bg: 'Бяло' }, value: 'white' },
  { label: { en: 'Black', bg: 'Черно' }, value: 'black' },
  { label: { en: 'Gold', bg: 'Злато' }, value: 'gold' },
  { label: { en: 'Red', bg: 'Червено' }, value: 'red' },
  { label: { en: 'Blue', bg: 'Синьо' }, value: 'blue' },
  { label: { en: 'Green', bg: 'Зелено' }, value: 'green' },
]

export const captionVerticalPositionOptions: LocalizedSelectOption[] = [
  { label: { en: 'Top', bg: 'Горе' }, value: 'top' },
  { label: { en: 'Center', bg: 'Център' }, value: 'center' },
  { label: { en: 'Bottom', bg: 'Долу' }, value: 'bottom' },
]

export const captionHorizontalAlignmentOptions: LocalizedSelectOption[] = [
  { label: { en: 'Left', bg: 'Ляво' }, value: 'left' },
  { label: { en: 'Center', bg: 'Център' }, value: 'center' },
  { label: { en: 'Right', bg: 'Дясно' }, value: 'right' },
]

export const captionBackgroundOptions: LocalizedSelectOption[] = [
  { label: { en: 'Dark', bg: 'Тъмен' }, value: 'dark' },
  { label: { en: 'Light', bg: 'Светъл' }, value: 'light' },
  { label: { en: 'None', bg: 'Без' }, value: 'none' },
]

export const captionContainerWidthOptions: LocalizedSelectOption[] = [
  { label: { en: 'Narrow (33%)', bg: 'Тясна (33%)' }, value: 'narrow' },
  { label: { en: 'Medium (50%)', bg: 'Средна (50%)' }, value: 'medium' },
  { label: { en: 'Wide (80%)', bg: 'Широка (80%)' }, value: 'wide' },
  { label: { en: 'Full (100%)', bg: 'Пълна (100%)' }, value: 'full' },
]

export const textShadowOptions: LocalizedSelectOption[] = [
  { label: { en: 'None', bg: 'Без' }, value: 'none' },
  { label: { en: 'Subtle', bg: 'Лека' }, value: 'subtle' },
  { label: { en: 'Strong', bg: 'Силна' }, value: 'strong' },
  { label: { en: 'Outline', bg: 'Контур' }, value: 'outline' },
]

export const captionAnimationOptions: LocalizedSelectOption[] = [
  { label: { en: 'None', bg: 'Без' }, value: 'none' },
  { label: { en: 'Fade In', bg: 'Поява' }, value: 'fadeIn' },
  { label: { en: 'Fade Out', bg: 'Изчезване' }, value: 'fadeOut' },
  { label: { en: 'Fade In/Out', bg: 'Поява/Изчезване' }, value: 'fadeInOut' },
  { label: { en: 'Slide Up', bg: 'Плъзгане нагоре' }, value: 'slideUp' },
  { label: { en: 'Slide Down', bg: 'Плъзгане надолу' }, value: 'slideDown' },
  { label: { en: 'Scale', bg: 'Мащабиране' }, value: 'scale' },
  { label: { en: 'Typewriter', bg: 'Пишеща машина' }, value: 'typewriter' },
]

export const mediaBlockLayoutOptions: LocalizedSelectOption[] = [
  { label: { en: 'Default', bg: 'По подразбиране' }, value: 'default' },
  { label: { en: 'Full Width', bg: 'Пълна ширина' }, value: 'fullWidth' },
  { label: { en: 'Full Bleed', bg: 'От край до край' }, value: 'fullBleed' },
]

export const mediaBlockBackgroundOptions: LocalizedSelectOption[] = [
  { label: { en: 'None', bg: 'Без' }, value: 'none' },
  { label: { en: 'Primary Light', bg: 'Основен светъл' }, value: 'primaryLight' },
  { label: { en: 'Dark', bg: 'Тъмен' }, value: 'dark' },
  { label: { en: 'Light', bg: 'Светъл' }, value: 'light' },
]

export const textAlignmentOptions: LocalizedSelectOption[] = [
  { label: { en: 'Left', bg: 'Ляво' }, value: 'left' },
  { label: { en: 'Center', bg: 'Център' }, value: 'center' },
  { label: { en: 'Right', bg: 'Дясно' }, value: 'right' },
]

export const imageHeightOptions: LocalizedSelectOption[] = [
  { label: { en: 'Auto', bg: 'Автоматично' }, value: 'auto' },
  { label: { en: 'Small (30vh)', bg: 'Малка (30vh)' }, value: 'sm' },
  { label: { en: 'Medium (50vh)', bg: 'Средна (50vh)' }, value: 'md' },
  { label: { en: 'Large (70vh)', bg: 'Голяма (70vh)' }, value: 'lg' },
  { label: { en: 'Full Screen', bg: 'Цял екран' }, value: 'screen' },
]
