import { payloadSidebar } from 'payload-sidebar-plugin'

export const sidebar = payloadSidebar({
  groupOrder: {
    // English
    Content: 1,
    Experiences: 2,
    Taxonomy: 3,
    Admin: 4,
    // Bulgarian
    'Съдържание': 1,
    'Преживявания': 2,
    'Номенклатури': 3,
    'Администрация': 4,
  },
  customGroups: [
    {
      label: 'Experiences',
      aliases: ['Преживявания'],
      order: 2,
    },
  ],
  icons: {
    pages: 'file-text',
    media: 'image',
    experiences: 'compass',
    hotels: 'hotel',
    restaurants: 'utensils-crossed',
    activities: 'person-standing',
    attractions: 'ferris-wheel',
    events: 'calendar',
    categories: 'folder-tree',
    tags: 'tag',
    regions: 'map',
    municipalities: 'building-2',
    cities: 'building',
    users: 'users',
    visitors: 'user-check',
    footer: 'panel-bottom',
    'main-menu': 'menu',
    settings: 'settings',
  },
  customLinks: [
    {
      label: 'Analytics' as string,
      href: '/admin/analytics',
      group: 'Experiences',
      icon: 'bar-chart-3',
      order: 2,
    },
  ],
  enablePinning: false,
})
