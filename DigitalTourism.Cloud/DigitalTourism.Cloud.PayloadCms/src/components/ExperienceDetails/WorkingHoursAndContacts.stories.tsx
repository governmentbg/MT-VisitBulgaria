'use client'

import type { Meta, StoryObj } from '@storybook/react'
import { WorkingHoursAndContacts } from './WorkingHoursAndContacts'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

const mockWorkingHours = {
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Понеделник - Петък: 09:00 - 18:00', version: 1 }],
        version: 1,
      },
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Събота - Неделя: 10:00 - 16:00', version: 1 }],
        version: 1,
      },
    ],
    direction: null,
    format: '' as any,
    indent: 0,
    version: 1,
  },
} as unknown as DefaultTypedEditorState

const meta = {
  title: 'ExperienceDetails/WorkingHoursAndContacts',
  component: WorkingHoursAndContacts,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ZZqtDe08ku8cJFtaWWFnMh/3-5-2026-VisitBG?node-id=940:2506',
    },
  },
} satisfies Meta<typeof WorkingHoursAndContacts>

export default meta
type Story = StoryObj<typeof meta>

export const FullData: Story = {
  args: {
    workingHours: mockWorkingHours,
    contact: {
      phone: '+359 888 123 456',
      email: 'info@rilski-manastir.bg',
      website: 'https://rilski-manastir.bg',
    },
    location: {
      address: 'Рилски манастир, 2643 Рила, България',
      coordinates: {
        latitude: 42.1333,
        longitude: 23.3401,
      },
    },
  },
}

export const NoMap: Story = {
  args: {
    workingHours: mockWorkingHours,
    contact: {
      phone: '+359 888 123 456',
      website: 'https://example.com',
    },
    location: {
      address: 'ул. Княз Борис I 45, София',
    },
  },
}

export const ContactOnly: Story = {
  args: {
    contact: {
      phone: '+359 2 987 6543',
      email: 'contact@hotel.bg',
      website: 'https://hotel-example.bg',
    },
  },
}

export const WorkingHoursOnly: Story = {
  args: {
    workingHours: mockWorkingHours,
  },
}
