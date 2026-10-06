import type { GlobalConfig } from 'payload'

import { adminOnly, hiddenFromNonCurator } from '@/access/accessHelpers'
import { newsletterTab } from './newsletterTab'
import { adminGroupLabels, settingsLabels, settingsDescriptions } from '@/i18n/admin'
import { validateHomePageLocales } from './hooks/validateHomePageLocales'
import { revalidateSettings } from './hooks/revalidateSettings'
import { populateDefaultFacetConfig, seedFacetConfigOnChange } from './hooks/populateDefaultFacetConfig'
import { hashSitePassword } from './hooks/hashSitePassword'

const publishedPageFilter = {
  _status: { equals: 'published' },
}

/** All available facet keys with their admin-facing labels */
const facetKeyOptions = [
  { label: { en: 'Experience Type', bg: 'Тип обект' }, value: 'type' },
  { label: { en: 'Categories', bg: 'Категории' }, value: 'categories' },
  { label: { en: 'Tags', bg: 'Етикети' }, value: 'tags' },
  { label: { en: 'Region', bg: 'Регион' }, value: 'region' },
  { label: { en: 'Municipality', bg: 'Община' }, value: 'municipality' },
  { label: { en: 'City', bg: 'Град' }, value: 'city' },
  { label: { en: 'Star Rating', bg: 'Звезди' }, value: 'starRating' },
  { label: { en: 'Amenities', bg: 'Удобства' }, value: 'amenities' },
  { label: { en: 'Cuisine Type', bg: 'Кухня' }, value: 'cuisineType' },
  { label: { en: 'Dietary Options', bg: 'Диетични опции' }, value: 'dietaryOptions' },
  { label: { en: 'Difficulty Level', bg: 'Трудност' }, value: 'difficultyLevel' },
  { label: { en: 'Seasonality', bg: 'Сезонност' }, value: 'seasonality' },
  { label: { en: 'Organizer', bg: 'Организатор' }, value: 'organizer' },
]

const selectionModeOptions = [
  { label: { en: 'Multi-select', bg: 'Множествен избор' }, value: 'multi' },
  { label: { en: 'Single-select', bg: 'Единичен избор' }, value: 'single' },
]

const filterModeOptions = [
  { label: { en: 'OR (any match)', bg: 'ИЛИ (поне едно)' }, value: 'or' },
  { label: { en: 'AND (all must match)', bg: 'И (всички)' }, value: 'and' },
]

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: {
    en: 'Settings',
    bg: 'Настройки',
  },
  admin: {
    group: adminGroupLabels.admin,
    hidden: hiddenFromNonCurator,
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  hooks: {
    beforeRead: [populateDefaultFacetConfig],
    beforeChange: [validateHomePageLocales, seedFacetConfigOnChange],
    afterChange: [revalidateSettings],
  },
  fields: [
    // Keep placeholder to avoid migration rename ambiguity; hidden from admin UI
    {
      name: 'placeholder',
      type: 'text',
      admin: { hidden: true },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: settingsLabels.pagesTab,
          fields: [
            {
              name: 'homePage',
              type: 'relationship',
              relationTo: 'pages',
              label: settingsLabels.homePage,
              admin: {
                description: settingsDescriptions.homePage,
              },
              filterOptions: publishedPageFilter,
            },
            {
              name: 'termsOfConditionsPage',
              type: 'relationship',
              relationTo: 'pages',
              label: settingsLabels.termsOfConditionsPage,
              admin: {
                description: settingsDescriptions.termsOfConditionsPage,
              },
              filterOptions: publishedPageFilter,
            },
            {
              name: 'privacyPolicyPage',
              type: 'relationship',
              relationTo: 'pages',
              label: settingsLabels.privacyPolicyPage,
              admin: {
                description: settingsDescriptions.privacyPolicyPage,
              },
              filterOptions: publishedPageFilter,
            },
            {
              name: 'businessTermsPage',
              type: 'relationship',
              relationTo: 'pages',
              label: settingsLabels.businessTermsPage,
              admin: {
                description: settingsDescriptions.businessTermsPage,
              },
              filterOptions: publishedPageFilter,
            },
          ],
        },
        {
          label: settingsLabels.mapTab,
          fields: [
            {
              name: 'mapMaxCityMarkers',
              type: 'number',
              label: settingsLabels.mapMaxCityMarkers,
              defaultValue: 50,
              min: 10,
              max: 200,
              admin: {
                description: settingsDescriptions.mapMaxCityMarkers,
                step: 5,
              },
            },
            {
              name: 'mapMaxExperienceMarkers',
              type: 'number',
              label: settingsLabels.mapMaxExperienceMarkers,
              defaultValue: 200,
              min: 20,
              max: 500,
              admin: {
                description: settingsDescriptions.mapMaxExperienceMarkers,
                step: 10,
              },
            },
            {
              name: 'mapZoomThreshold',
              type: 'number',
              label: settingsLabels.mapZoomThreshold,
              defaultValue: 12,
              min: 8,
              max: 16,
              admin: {
                description: settingsDescriptions.mapZoomThreshold,
                step: 1,
              },
            },
          ],
        },
        {
          label: settingsLabels.filtersTab,
          fields: [
            {
              name: 'facetConfig',
              type: 'array',
              label: settingsLabels.facetConfig,
              labels: {
                singular: { en: 'Facet', bg: 'Фасет' },
                plural: { en: 'Facets', bg: 'Фасети' },
              },
              admin: {
                description: settingsDescriptions.facetConfig,
                initCollapsed: true,
                components: {
                  RowLabel: '@/globals/Settings/components/FacetRowLabel',
                },
              },
              defaultValue: facetKeyOptions.map((opt, i) => ({
                facetKey: opt.value,
                enabled: opt.value !== 'region',
                defaultExpanded: ['type', 'categories', 'region', 'city'].includes(opt.value),
                maxVisible: ['categories', 'tags', 'amenities', 'cuisineType', 'dietaryOptions', 'organizer'].includes(opt.value) ? 5
                  : ['region', 'municipality', 'city'].includes(opt.value) ? 7
                  : undefined,
                sortOrder: (i + 1) * 10,
                selectionMode: 'multi',
                filterMode: ['amenities', 'dietaryOptions'].includes(opt.value) ? 'and' : 'or',
              })),
              fields: [
                {
                  name: 'facetKey',
                  type: 'select',
                  label: settingsLabels.facetKey,
                  required: true,
                  options: facetKeyOptions,
                  admin: { width: '25%' },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: settingsLabels.facetEnabled,
                  defaultValue: true,
                  admin: { width: '15%' },
                },
                {
                  name: 'defaultExpanded',
                  type: 'checkbox',
                  label: settingsLabels.facetDefaultExpanded,
                  defaultValue: false,
                  admin: { width: '15%' },
                },
                {
                  name: 'maxVisible',
                  type: 'number',
                  label: settingsLabels.facetMaxVisible,
                  min: 1,
                  max: 50,
                  admin: {
                    width: '15%',
                    description: settingsDescriptions.facetMaxVisible,
                    step: 1,
                  },
                },
                {
                  name: 'sortOrder',
                  type: 'number',
                  label: settingsLabels.facetSortOrder,
                  defaultValue: 10,
                  min: 0,
                  max: 999,
                  admin: {
                    width: '15%',
                    description: settingsDescriptions.facetSortOrder,
                    step: 1,
                  },
                },
                {
                  name: 'selectionMode',
                  type: 'select',
                  label: settingsLabels.facetSelectionMode,
                  defaultValue: 'multi',
                  options: selectionModeOptions,
                  admin: {
                    width: '12%',
                    description: settingsDescriptions.facetSelectionMode,
                  },
                },
                {
                  name: 'filterMode',
                  type: 'select',
                  label: settingsLabels.facetFilterMode,
                  defaultValue: 'or',
                  options: filterModeOptions,
                  admin: {
                    width: '12%',
                    description: settingsDescriptions.facetFilterMode,
                  },
                },
              ],
            },
          ],
        },
        {
          label: settingsLabels.siteIdentityTab,
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: settingsLabels.siteName,
              localized: true,
              admin: {
                description: settingsDescriptions.siteName,
              },
            },
            {
              name: 'siteTagline',
              type: 'text',
              label: settingsLabels.siteTagline,
              localized: true,
              admin: {
                description: settingsDescriptions.siteTagline,
              },
            },
            {
              name: 'defaultMetaDescription',
              type: 'textarea',
              label: settingsLabels.defaultMetaDescription,
              localized: true,
              admin: {
                description: settingsDescriptions.defaultMetaDescription,
              },
            },
          ],
        },
        {
          label: settingsLabels.workflowTab,
          fields: [
            {
              name: 'requireAllTranslations',
              type: 'checkbox',
              label: settingsLabels.requireAllTranslations,
              defaultValue: false,
              admin: {
                description: settingsDescriptions.requireAllTranslations,
              },
            },
          ],
        },
        {
          label: settingsLabels.accessTab,
          fields: [
            {
              name: 'sitePasswordEnabled',
              type: 'checkbox',
              label: settingsLabels.sitePasswordEnabled,
              defaultValue: false,
              admin: {
                description: settingsDescriptions.sitePasswordEnabled,
              },
            },
            {
              name: 'sitePassword',
              type: 'text',
              label: settingsLabels.sitePassword,
              admin: {
                description: settingsDescriptions.sitePassword,
                condition: (data) => data?.sitePasswordEnabled === true,
                components: {
                  Field: '@/globals/Settings/components/SitePasswordField',
                },
              },
              hooks: {
                beforeChange: [hashSitePassword],
              },
            },
            {
              name: 'sitePasswordHash',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'allowCrawlerIndexing',
              type: 'checkbox',
              label: settingsLabels.allowCrawlerIndexing,
              defaultValue: false,
              admin: {
                description: settingsDescriptions.allowCrawlerIndexing,
              },
            },
          ],
        },
        newsletterTab,
      ],
    },
  ],
}
