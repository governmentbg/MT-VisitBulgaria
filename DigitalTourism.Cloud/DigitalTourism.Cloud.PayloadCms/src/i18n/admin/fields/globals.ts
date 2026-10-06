import type { LocalizedLabel, LocalizedSelectOption } from '../types'

/**
 * Footer field labels
 */
export const footerLabels: Record<string, LocalizedLabel> = {
  navItems: { en: 'Navigation Items', bg: 'Навигационни елементи' },
  linkGroups: { en: 'Link Groups', bg: 'Групи от връзки' },
  groupTitle: { en: 'Group Title', bg: 'Заглавие на група' },
  groupLinks: { en: 'Links', bg: 'Връзки' },
  socialLinks: { en: 'Social Links', bg: 'Социални мрежи' },
  socialUrl: { en: 'URL', bg: 'URL' },
  socialLabel: { en: 'Label', bg: 'Етикет' },
  newsletterHeadline: { en: 'Newsletter Headline', bg: 'Заглавие на бюлетин' },
  newsletterSubtitle: { en: 'Newsletter Subtitle', bg: 'Подзаглавие на бюлетин' },
}

/**
 * Main menu field labels
 */
export const mainMenuLabels: Record<string, LocalizedLabel> = {
  tabs: { en: 'Menu Items', bg: 'Елементи на менюто' },
  label: { en: 'Label', bg: 'Етикет' },
  enableDirectLink: { en: 'Enable Direct Link', bg: 'Активиране на директна връзка' },
  enableDropdown: { en: 'Enable Dropdown', bg: 'Активиране на падащо меню' },
  directLink: { en: 'Direct Link', bg: 'Директна връзка' },
  dropdownMenu: { en: 'Dropdown Menu', bg: 'Падащо меню' },
  description: { en: 'Description', bg: 'Описание' },
  dropdownType: { en: 'Dropdown Type', bg: 'Тип на падащото меню' },
  navItems: { en: 'Navigation Items', bg: 'Навигационни елементи' },
  listLinks: { en: 'List Links', bg: 'Списък с връзки' },
  tag: { en: 'Tag', bg: 'Етикет' },
  links: { en: 'Links', bg: 'Връзки' },
}

/**
 * Main menu field descriptions
 */
export const mainMenuDescriptions: Record<string, LocalizedLabel> = {
  enableDirectLink: {
    en: 'When enabled, this tab will link directly to a page',
    bg: 'Когато е активирано, този раздел ще води директно към страница',
  },
  enableDropdown: {
    en: 'When enabled, this tab will show a dropdown menu',
    bg: 'Когато е активирано, този раздел ще показва падащо меню',
  },
  description: {
    en: 'Optional description shown at the top of the dropdown',
    bg: 'Незадължително описание, показано в началото на падащото меню',
  },
  dropdownType: {
    en: 'Choose the dropdown layout: Directions (image cards) or Info (text columns)',
    bg: 'Изберете оформлението на менюто: Дестинации (карти с изображения) или Информация (текстови колони)',
  },
  navImage: {
    en: 'Image shown in Directions dropdown cards',
    bg: 'Изображение, показано в картите на падащото меню Дестинации',
  },
}

/**
 * Dropdown type options
 */
export const dropdownTypeOptions: LocalizedSelectOption[] = [
  { label: { en: 'Directions', bg: 'Дестинации' }, value: 'directions' },
  { label: { en: 'Info', bg: 'Информация' }, value: 'info' },
]
