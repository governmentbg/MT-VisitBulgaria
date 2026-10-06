import type { Block } from 'payload'
import { blockImageUrls } from '@/features/expandedBlocks/blockImageUrls'
import { blockGroupLabels, experienceTypeOptions } from '@/i18n/admin'
import { link } from '@/fields/link'
import {
  blockLabels,
  fieldLabels,
  sortOptions,
  displayModeOptions,
  sectionVariantOptions,
  decorationImageOptions,
  decorationAlignmentOptions,
  backgroundShapeOptions,
  overlayCardStyleOptions,
  overlayLayoutOptions,
  headerAlignmentOptions,
  groupLabels,
} from '../../i18n/labels'

const _isCarousel = (_: unknown, siblingData: Record<string, unknown>) =>
  siblingData?.displayMode !== 'grid' && !!siblingData?.displayMode

const _isOverlay = (_: unknown, siblingData: Record<string, unknown>) =>
  siblingData?.displayMode === 'carouselOverlay'

export const ExperienceListingBlock: Block = {
  slug: 'experienceListing',
  interfaceName: 'ExperienceListingBlock',
  labels: blockLabels,
  imageURL: blockImageUrls.experienceListing,
  imageAltText: 'Experience listing',
  admin: {
    group: blockGroupLabels.dataListings,
  },
  fields: [
    // === Display Mode + Experience Type ===
    {
      type: 'row',
      fields: [
        {
          name: 'displayMode',
          type: 'select',
          label: fieldLabels.displayMode,
          defaultValue: 'grid',
          options: displayModeOptions,
          admin: { width: '50%' },
        },
        {
          name: 'defaultType',
          type: 'select',
          hasMany: true,
          label: fieldLabels.defaultType,
          options: experienceTypeOptions,
          admin: { width: '50%' },
        },
      ],
    },
    // === Content & Preview (always visible) ===
    {
      type: 'collapsible',
      label: groupLabels.contentPreview,
      admin: { initCollapsed: true },
      fields: [
        // Default filters
        {
          name: 'defaultCategories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          label: fieldLabels.defaultCategories,
        },
        {
          name: 'defaultTags',
          type: 'relationship',
          relationTo: 'tags',
          hasMany: true,
          label: fieldLabels.defaultTags,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'defaultRegion',
              type: 'relationship',
              relationTo: 'regions',
              hasMany: true,
              label: fieldLabels.defaultRegion,
              admin: { width: '33%' },
            },
            {
              name: 'defaultMunicipality',
              type: 'relationship',
              relationTo: 'municipalities',
              hasMany: true,
              label: fieldLabels.defaultMunicipality,
              admin: { width: '33%' },
            },
            {
              name: 'defaultCity',
              type: 'relationship',
              relationTo: 'cities',
              hasMany: true,
              label: fieldLabels.defaultCity,
              admin: { width: '33%' },
            },
          ],
        },

        // Display settings
        {
          type: 'row',
          fields: [
            {
              name: 'itemsPerPage',
              type: 'number',
              label: fieldLabels.itemsPerPage,
              defaultValue: 12,
              min: 1,
              max: 48,
              admin: { width: '50%', step: 1 },
            },
            {
              name: 'defaultSort',
              type: 'select',
              label: fieldLabels.defaultSort,
              defaultValue: 'relevance',
              options: sortOptions,
              admin: { width: '50%' },
            },
          ],
        },

        // Feature toggles (grid only)
        {
          type: 'row',
          fields: [
            {
              name: 'showAdvancedSearch',
              type: 'checkbox',
              label: fieldLabels.showAdvancedSearch,
              defaultValue: false,
              admin: { width: '33%' },
            },
            {
              name: 'showSearchInput',
              type: 'checkbox',
              label: fieldLabels.showSearchInput,
              defaultValue: false,
              admin: { width: '33%' },
            },
            {
              name: 'showFilters',
              type: 'checkbox',
              label: { en: 'Show Filters', bg: 'Покажи филтри' },
              defaultValue: true,
              admin: { width: '33%' },
            },
          ],
        },

        // Result count
        {
          name: 'previewCount',
          type: 'ui',
          admin: {
            components: {
              Field: '@/plugins/experience-listing/components/admin/PreviewCount',
            },
          },
        },
        // Preview grid
        {
          type: 'collapsible',
          label: { en: 'Preview', bg: 'Преглед' },
          admin: { initCollapsed: true },
          fields: [
            {
              name: 'preview',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/plugins/experience-listing/components/admin/ExperienceListingPreview',
                },
              },
            },
          ],
        },
      ],
    },
    // === Section Header (always visible) ===
    {
      type: 'collapsible',
      label: groupLabels.sectionHeader,
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'heading',
              type: 'text',
              label: fieldLabels.heading,
              localized: true,
              admin: { width: '50%' },
            },
            {
              name: 'description',
              type: 'textarea',
              label: fieldLabels.description,
              localized: true,
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'sectionLabel',
              type: 'text',
              label: fieldLabels.sectionLabel,
              localized: true,
              admin: { width: '50%' },
            },
            {
              name: 'headerAlignment',
              type: 'select',
              label: fieldLabels.headerAlignment,
              defaultValue: 'left',
              options: headerAlignmentOptions,
              admin: { width: '50%' },
            },
          ],
        },
        link({
          appearances: false,
          overrides: {
            name: 'viewAllLink',
            label: fieldLabels.viewAllLink,
            admin: { hideGutter: true },
          },
        }),
      ],
    },

    // === Carousel Style (carousel modes only) ===
    {
      type: 'collapsible',
      label: groupLabels.carouselStyle,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'sectionVariant',
              type: 'select',
              label: fieldLabels.sectionVariant,
              defaultValue: 'light',
              options: sectionVariantOptions,
              admin: { width: '25%' },
            },
            {
              name: 'decorationImage',
              type: 'select',
              label: fieldLabels.decorationImage,
              defaultValue: 'none',
              options: decorationImageOptions,
              admin: { width: '25%' },
            },
            {
              name: 'decorationAlignment',
              type: 'select',
              label: fieldLabels.decorationAlignment,
              defaultValue: 'left',
              options: decorationAlignmentOptions,
              admin: { width: '25%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isFocused',
              type: 'checkbox',
              label: fieldLabels.isFocused,
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'showMonthFilter',
              type: 'checkbox',
              label: fieldLabels.showMonthFilter,
              defaultValue: false,
              admin: { width: '25%' },
            },
          ],
        },
        {
          name: 'backgroundShape',
          type: 'select',
          label: fieldLabels.backgroundShape,
          defaultValue: 'full',
          options: backgroundShapeOptions,
        },
      ],
    },
    // === Overlay Settings (overlay mode only) ===
    {
      type: 'collapsible',
      label: groupLabels.overlaySettings,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'overlayCardStyle',
              type: 'select',
              label: fieldLabels.overlayCardStyle,
              defaultValue: 'overlay',
              options: overlayCardStyleOptions,
              admin: { width: '50%' },
            },
            {
              name: 'overlayLayout',
              type: 'select',
              label: fieldLabels.overlayLayout,
              defaultValue: 'sideBySide',
              options: overlayLayoutOptions,
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
