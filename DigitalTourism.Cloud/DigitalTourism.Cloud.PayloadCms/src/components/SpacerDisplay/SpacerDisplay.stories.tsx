'use client'

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '@/components/ui/theme/figma'
import { SpacerScene } from './SpacerScene'
import type { SpacerSceneProps } from './types'

const MOUNTAIN_IMAGE =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop'
const FOREST_IMAGE =
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&h=1080&fit=crop'

/**
 * Decorator simulating adjacent page sections so offset overlap is visible.
 * Uses inline backgroundColor to guarantee exact color match with gradients.
 */
const sectionDecorator = (
  topColor: string,
  bottomColor: string,
) => [
  (Story: React.FC) => (
    <div>
      <div
        className="relative z-10 p-12 text-center"
        style={{ backgroundColor: topColor, color: topColor === '#ffffff' ? '#6b7280' : '#fff' }}
      >
        <p className="font-sans text-lg">Section above (z-10 — sits on top of spacer)</p>
      </div>
      <Story />
      <div
        className="relative z-10 p-12 text-center"
        style={{ backgroundColor: bottomColor, color: bottomColor === '#ffffff' ? '#6b7280' : '#fff' }}
      >
        <p className="font-sans text-lg">Section below (z-10 — sits on top of spacer)</p>
      </div>
    </div>
  ),
]

const meta = {
  title: 'Components/SpacerScene',
  component: SpacerScene,
  parameters: {
    layout: 'fullscreen',
    ...figmaDesign('40000836-2182'),
  },
} satisfies Meta<typeof SpacerScene>

export default meta
type Story = StoryObj<typeof meta>

/** Bare image, no gradients or text */
export const ImageOnly: Story = {
  args: {
    image: MOUNTAIN_IMAGE,
    alt: 'Mountain landscape',
    height: '40vh',
  },
}

/** Top gradient fading from white */
export const WithFadeIn: Story = {
  args: {
    image: MOUNTAIN_IMAGE,
    alt: 'Mountain landscape',
    height: '40vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 50 },
  },
}

/** Bottom gradient fading to teal */
export const WithFadeOut: Story = {
  args: {
    image: MOUNTAIN_IMAGE,
    alt: 'Mountain landscape',
    height: '40vh',
    fadeOut: { enabled: true, color: '#00675c', height: 50 },
  },
}

/** Both gradients — white top, teal bottom */
export const WithBothGradients: Story = {
  args: {
    image: MOUNTAIN_IMAGE,
    alt: 'Mountain landscape',
    height: '50vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 45 },
    fadeOut: { enabled: true, color: '#00675c', height: 50 },
  },
}

/** Overlay text with display font (Sensa Sans — Latin glyphs only in demo) */
export const WithOverlayText: Story = {
  args: {
    image: FOREST_IMAGE,
    alt: 'Misty forest',
    height: '50vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 50 },
    fadeOut: { enabled: true, color: '#00675c', height: 50 },
    overlayText: {
      text: 'Discover the secrets of our ancient lands...',
      positionX: 65,
      positionY: 30,
      font: 'display',
    },
  },
  parameters: figmaDesign('40000836-2182'),
}

/**
 * Negative offset — spacer slides UNDER adjacent sections.
 * Adjacent sections have z-10 so they overlap the spacer edges,
 * creating the cinematic "peek through" effect from the Figma design.
 */
export const SlideUnder: Story = {
  decorators: sectionDecorator('#ffffff', '#ffffff'),
  args: {
    image: FOREST_IMAGE,
    alt: 'Misty forest',
    height: '40vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 50 },
    fadeOut: { enabled: true, color: '#ffffff', height: 50 },
    offsetTop: -80,
    offsetBottom: -80,
  },
  parameters: figmaDesign('904-15956'),
}

/**
 * Full cinematic example matching the Figma Spacer node.
 * White top fading into misty forest, teal bottom fading into next section.
 * Display font text positioned upper-right like the original design.
 */
export const FullExample: Story = {
  decorators: sectionDecorator('#ffffff', '#00675c'),
  args: {
    image: FOREST_IMAGE,
    alt: 'Misty Bulgarian forest',
    height: '50vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 55 },
    fadeOut: { enabled: true, color: '#00675c', height: 55 },
    overlayText: {
      text: 'Discover the secrets of our ancient lands...',
      positionX: 65,
      positionY: 30,
      font: 'display',
    },
    offsetTop: -64,
    offsetBottom: -64,
  },
  parameters: figmaDesign('40000836-2182'),
}

/** Compact spacer — minimal height for subtle section breaks */
export const Compact: Story = {
  decorators: sectionDecorator('#ffffff', '#ffffff'),
  args: {
    image: MOUNTAIN_IMAGE,
    alt: 'Mountain landscape',
    height: '30vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 60 },
    fadeOut: { enabled: true, color: '#ffffff', height: 60 },
    offsetTop: -48,
    offsetBottom: -48,
  },
}

/** Interactive playground with all props exposed */
export const Playground: Story = {
  decorators: sectionDecorator('#ffffff', '#00675c'),
  args: {
    image: FOREST_IMAGE,
    alt: 'Mountain landscape',
    height: '50vh',
    fadeIn: { enabled: true, color: '#ffffff', height: 50 },
    fadeOut: { enabled: true, color: '#00675c', height: 50 },
    overlayText: {
      text: 'Bulgaria',
      positionX: 50,
      positionY: 40,
      font: 'display',
    },
    offsetTop: -64,
    offsetBottom: -64,
  } satisfies SpacerSceneProps,
}
