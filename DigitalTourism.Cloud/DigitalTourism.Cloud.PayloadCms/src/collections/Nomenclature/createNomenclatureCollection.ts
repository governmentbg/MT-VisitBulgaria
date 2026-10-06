import type { CollectionConfig } from 'payload'
import type { CollectionLabels, LocalizedLabel } from '@/i18n/admin/types'
import { curatorOrAdmin, hiddenFromNonCurator } from '@/access/accessHelpers'
import { iconField } from '@/fields/lucide-icon-picker/field'
import { nomenclatureLabels, nomenclatureDescriptions } from '@/i18n/admin'

interface NomenclatureCollectionConfig {
  slug: string
  labels: CollectionLabels
  adminGroup: LocalizedLabel
}

/**
 * Factory function to create a nomenclature/reference data collection.
 * These collections store the option values that were previously hardcoded
 * as select options (amenities, cuisine types, dietary options, seasons, difficulty levels).
 */
export function createNomenclatureCollection({
  slug,
  labels,
  adminGroup,
}: NomenclatureCollectionConfig): CollectionConfig {
  return {
    slug,
    labels,
    defaultSort: 'sortOrder',
    admin: {
      group: adminGroup,
      hidden: hiddenFromNonCurator,
      useAsTitle: 'name',
      defaultColumns: ['name', 'value', 'iconName', 'sortOrder'],
    },
    access: {
      read: () => true,
      create: curatorOrAdmin,
      update: curatorOrAdmin,
      delete: curatorOrAdmin,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        localized: true,
        label: nomenclatureLabels.name,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
        unique: true,
        index: true,
        label: nomenclatureLabels.value,
        admin: {
          description: nomenclatureDescriptions.value,
        },
      },
      iconField({
        name: 'iconName',
        showTextInput: true,
        searchable: true,
        categorized: true,
        searchPlaceholder: 'Search icons...',
        triggerPlaceholder: 'Select Icon',
        overrides: (field) => ({
          ...field,
          label: nomenclatureLabels.iconName,
        }),
      }),
      {
        name: 'svgContent',
        type: 'textarea',
        label: nomenclatureLabels.svgContent,
        admin: {
          description: nomenclatureDescriptions.svgContent,
          condition: (data) => !data?.iconName,
        },
      },
      {
        name: 'sortOrder',
        type: 'number',
        defaultValue: 0,
        label: nomenclatureLabels.sortOrder,
        admin: {
          position: 'sidebar',
        },
      },
    ],
  }
}
