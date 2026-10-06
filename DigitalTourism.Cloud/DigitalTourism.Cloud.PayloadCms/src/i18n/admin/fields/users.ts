import type { LocalizedLabel } from '../types'

/**
 * User-specific field labels
 */
export const userLabels: Record<string, LocalizedLabel> = {
  name: { en: 'Name', bg: 'Име' },
  firstName: { en: 'First Name', bg: 'Име' },
  lastName: { en: 'Last Name', bg: 'Фамилия' },
  email: { en: 'Email', bg: 'Имейл' },
  keycloakId: { en: 'Keycloak ID', bg: 'Keycloak ID' },
  roles: { en: 'Roles', bg: 'Роли' },
  lastLogin: { en: 'Last Login', bg: 'Последно влизане' },
  isActive: { en: 'Active', bg: 'Активен' },
  keycloakSyncStatus: { en: 'Sync Status', bg: 'Статус на синхронизация' },
  keycloakSyncedAt: { en: 'Last Synced', bg: 'Последна синхронизация' },
}

/**
 * User field descriptions
 */
export const userDescriptions: Record<string, LocalizedLabel> = {
  email: { en: 'User email address', bg: 'Имейл адрес на потребителя' },
  keycloakId: { en: 'External identity provider ID', bg: 'Външен идентификатор на доставчик' },
  roles: { en: 'User roles for access control', bg: 'Потребителски роли за контрол на достъпа' },
  lastLogin: { en: 'Last time the user logged in', bg: 'Последно влизане на потребителя' },
  isActive: { en: 'Whether this user account is active', bg: 'Дали този потребителски акаунт е активен' },
  keycloakSyncStatus: { en: 'Synchronization status with identity provider', bg: 'Статус на синхронизация с доставчика на идентичност' },
  keycloakSyncedAt: { en: 'Last synchronization time', bg: 'Време на последната синхронизация' },
}

/**
 * Visitor-specific field labels
 */
export const visitorLabels: Record<string, LocalizedLabel> = {
  name: { en: 'Name', bg: 'Име' },
  email: { en: 'Email', bg: 'Имейл' },
  keycloakId: { en: 'Keycloak ID', bg: 'Keycloak ID' },
  language: { en: 'Language', bg: 'Език' },
  preferences: { en: 'Preferences', bg: 'Предпочитания' },
  notifications: { en: 'Notifications', bg: 'Известия' },
  emailNotifications: { en: 'Email notifications', bg: 'Имейл известия' },
  pushNotifications: { en: 'Push notifications', bg: 'Push известия' },
  interests: { en: 'Interests', bg: 'Интереси' },
}

/**
 * Visitor field descriptions
 */
export const visitorDescriptions: Record<string, LocalizedLabel> = {
  name: { en: 'Display name from Keycloak', bg: 'Име за показване от Keycloak' },
  email: { en: 'Email from Frontoffice Keycloak', bg: 'Имейл от Frontoffice Keycloak' },
  keycloakId: { en: 'Keycloak user ID from frontoffice realm (sub claim)', bg: 'Keycloak потребителски ID от frontoffice realm (sub claim)' },
  language: { en: 'Preferred language for content', bg: 'Предпочитан език за съдържание' },
  preferences: { en: 'User preferences for personalization', bg: 'Потребителски предпочитания за персонализация' },
  interests: { en: 'Categories the visitor is interested in', bg: 'Категории, от които посетителят се интересува' },
}

/**
 * Visitor admin descriptions
 */
export const visitorAdminDescriptions: Record<string, LocalizedLabel> = {
  collection: { en: 'Frontend visitors from website and mobile app (read-only from admin panel)', bg: 'Посетители от уебсайта и мобилното приложение (само за четене от админ панела)' },
}

/**
 * Media field labels
 */
export const mediaLabels: Record<string, LocalizedLabel> = {
  alt: { en: 'Alt Text', bg: 'Алтернативен текст' },
  caption: { en: 'Caption', bg: 'Надпис' },
}
