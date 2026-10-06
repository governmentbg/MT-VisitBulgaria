import type { CollectionLabels, GlobalLabels, LocalizedLabel } from './types'

/**
 * Collection labels for all collections
 */
export const collectionLabels: Record<string, CollectionLabels> = {
  pages: {
    singular: { en: 'Page', bg: 'Страница' },
    plural: { en: 'Pages', bg: 'Страници' },
  },
  experiences: {
    singular: { en: 'Experience', bg: 'Обект' },
    plural: { en: 'Experiences', bg: 'Обекти' },
  },
  media: {
    singular: { en: 'Media', bg: 'Медия' },
    plural: { en: 'Media', bg: 'Медия' },
  },
  categories: {
    singular: { en: 'Category', bg: 'Категория' },
    plural: { en: 'Categories', bg: 'Категории' },
  },
  users: {
    singular: { en: 'User', bg: 'Потребител' },
    plural: { en: 'Users', bg: 'Потребители' },
  },
  visitors: {
    singular: { en: 'Visitor', bg: 'Посетител' },
    plural: { en: 'Visitors', bg: 'Посетители' },
  },
  regions: {
    singular: { en: 'Region', bg: 'Регион' },
    plural: { en: 'Regions', bg: 'Региони' },
  },
  municipalities: {
    singular: { en: 'Municipality', bg: 'Община' },
    plural: { en: 'Municipalities', bg: 'Общини' },
  },
  cities: {
    singular: { en: 'City', bg: 'Град' },
    plural: { en: 'Cities', bg: 'Градове' },
  },
  tags: {
    singular: { en: 'Tag', bg: 'Етикет' },
    plural: { en: 'Tags', bg: 'Етикети' },
  },
  hotels: {
    singular: { en: 'Hotel', bg: 'Хотел' },
    plural: { en: 'Hotels', bg: 'Хотели' },
  },
  restaurants: {
    singular: { en: 'Restaurant', bg: 'Ресторант' },
    plural: { en: 'Restaurants', bg: 'Ресторанти' },
  },
  activities: {
    singular: { en: 'Activity', bg: 'Дейност' },
    plural: { en: 'Activities', bg: 'Дейности' },
  },
  attractions: {
    singular: { en: 'Attraction', bg: 'Атракция' },
    plural: { en: 'Attractions', bg: 'Атракции' },
  },
  events: {
    singular: { en: 'Event', bg: 'Събитие' },
    plural: { en: 'Events', bg: 'Събития' },
  },
  amenities: {
    singular: { en: 'Amenity', bg: 'Удобство' },
    plural: { en: 'Amenities', bg: 'Удобства' },
  },
  cuisineTypes: {
    singular: { en: 'Cuisine Type', bg: 'Вид кухня' },
    plural: { en: 'Cuisine Types', bg: 'Видове кухня' },
  },
  dietaryOptions: {
    singular: { en: 'Dietary Option', bg: 'Диетична опция' },
    plural: { en: 'Dietary Options', bg: 'Диетични опции' },
  },
  seasons: {
    singular: { en: 'Season', bg: 'Сезон' },
    plural: { en: 'Seasons', bg: 'Сезони' },
  },
  difficultyLevels: {
    singular: { en: 'Difficulty Level', bg: 'Ниво на трудност' },
    plural: { en: 'Difficulty Levels', bg: 'Нива на трудност' },
  },
  newsletterSubscriptions: {
    singular: { en: 'Newsletter Subscription', bg: 'Абонамент за бюлетин' },
    plural: { en: 'Newsletter Subscriptions', bg: 'Абонаменти за бюлетин' },
  },
}

/**
 * Global configuration labels
 */
export const globalLabels: Record<string, GlobalLabels> = {
  footer: {
    label: { en: 'Footer', bg: 'Футър' },
  },
  mainMenu: {
    label: { en: 'Main Menu', bg: 'Главно меню' },
  },
}

/**
 * Admin group labels
 */
export const adminGroupLabels: Record<string, LocalizedLabel> = {
  content: { en: 'Content', bg: 'Съдържание' },
  experiences: { en: 'Experiences', bg: 'Обекти' },  
  taxonomy: { en: 'Taxonomy', bg: 'Таксономия' },
  admin: { en: 'Admin', bg: 'Администрация' },
  settings: { en: 'Settings', bg: 'Настройки' },
}
