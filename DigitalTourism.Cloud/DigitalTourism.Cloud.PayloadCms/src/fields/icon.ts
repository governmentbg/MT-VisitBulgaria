import type { Field } from 'payload'

export const iconField = (overrides?: Partial<Field>): Field => ({
  name: 'icon',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Upload an SVG or small PNG icon.',
  },
  ...overrides,
} as Field)
