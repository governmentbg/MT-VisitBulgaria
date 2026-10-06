import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { FeatureHighlight } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'
import { Button } from '@/components/ui/primitives/Button'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'

const PlaceholderImage = ({ src = PLACEHOLDER_IMAGE }: { src?: string }) => (
  <img
    src={src}
    alt="Placeholder"
    className="h-full w-full object-cover"
    style={{ aspectRatio: '4/3' }}
  />
)

const meta = {
  title: 'Components/FeatureHighlight',
  component: FeatureHighlight,
  parameters: {
    layout: 'fullscreen',
    ...figmaDesign('40000003:5006'),
  },
  argTypes: {
    imagePosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    showBackground: { control: 'boolean' },
    showDecoration: { control: 'boolean' },
  },
} satisfies Meta<typeof FeatureHighlight>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'Земята на Орфей',
    description: (
      <p>
        Родопите са свързани с древногръцката митология и легендата за Орфей - тракийския певец и
        музикант. Планината е дом на уникална флора и фауна, включително редки растителни и
        животински видове. Тук се намират над 300 пещери, включително знаменитата Дяволското гърло.
      </p>
    ),
    buttonLabel: 'Научи повече',
    buttonHref: '/regions/rhodope',
    image: <PlaceholderImage />,
    imagePosition: 'right',
    showBackground: true,
    showDecoration: true,
  },
}

export const ImageLeft: Story = {
  args: {
    ...Default.args,
    imagePosition: 'left',
  },
}

export const WithoutDecoration: Story = {
  args: {
    ...Default.args,
    showDecoration: false,
  },
}

export const WithoutBackground: Story = {
  args: {
    ...Default.args,
    showBackground: false,
    showDecoration: false,
  },
}

export const EnglishContent: Story = {
  args: {
    heading: 'The Land of Orpheus',
    description: (
      <p>
        The Rhodope Mountains are associated with ancient Greek mythology and the legend of Orpheus —
        the Thracian singer and musician. The mountain is home to unique flora and fauna, including
        rare plant and animal species. Here you can find over 300 caves, including the famous
        Devil&apos;s Throat.
      </p>
    ),
    buttonLabel: 'Learn more',
    buttonHref: '/regions/rhodope',
    image: <PlaceholderImage />,
    showBackground: true,
    showDecoration: true,
  },
}

export const Compact: Story = {
  args: {
    heading: 'Пловдив',
    description: <p>Един от най-старите градове в Европа с богата история и култура.</p>,
    buttonLabel: 'Открий',
    buttonHref: '/regions/plovdiv',
    image: <PlaceholderImage />,
    showBackground: true,
    showDecoration: false,
  },
}

export const NoButton: Story = {
  args: {
    heading: 'Земята на Орфей',
    description: (
      <p>
        Родопите са свързани с древногръцката митология и легендата за Орфей - тракийския певец и
        музикант.
      </p>
    ),
    image: <PlaceholderImage />,
    showBackground: true,
    showDecoration: true,
  },
}

export const CustomActions: Story = {
  args: {
    heading: 'Земята на Орфей',
    description: (
      <p>
        Родопите са свързани с древногръцката митология и легендата за Орфей - тракийския певец и
        музикант.
      </p>
    ),
    image: <PlaceholderImage />,
    showBackground: true,
    showDecoration: true,
    actions: (
      <>
        <Button variant="primary" size="sm">
          Научи повече
        </Button>
        <Button variant="secondary" size="sm">
          Виж галерия
        </Button>
      </>
    ),
  },
}
