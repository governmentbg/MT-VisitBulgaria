import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { LikeButton } from './LikeButton'
import type { LikeButtonProps } from './LikeButton'
import { Stack } from '../layout/Stack'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/LikeButton',
  component: LikeButton,
  parameters: { layout: 'padded', ...figmaDesign('1335:9553') },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    liked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof LikeButton>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider col-span-full">
    {children}
  </h3>
)

const SizeLabel = ({ children }: { children: React.ReactNode }) => (
  <Stack as="span" align="center" gap="none" className="text-xs text-muted-foreground">{children}</Stack>
)

export const Showcase: Story = {
  render: () => (
    <Stack gap="2xl" className="max-w-4xl">
      <Stack gap="xs">
        <h2 className="text-h4 font-semibold">LikeButton</h2>
        <p className="text-body-md text-muted-foreground">
          Heart toggle button for liking/saving objects. Two variants (primary, secondary) with default and liked states.
        </p>
      </Stack>

      <Stack gap="xl">
        {/* Primary */}
        <Stack gap="sm">
          <SectionLabel>Primary</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <Stack align="center"><LikeButton variant="primary" size="sm" /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="md" /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="lg" /></Stack>

            <span className="text-xs text-muted-foreground">Liked</span>
            <Stack align="center"><LikeButton variant="primary" size="sm" liked /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="md" liked /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="lg" liked /></Stack>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <Stack align="center"><LikeButton variant="primary" size="sm" disabled /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="md" disabled /></Stack>
            <Stack align="center"><LikeButton variant="primary" size="lg" disabled /></Stack>
          </div>
        </Stack>

        {/* Secondary */}
        <Stack gap="sm">
          <SectionLabel>Secondary</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <Stack align="center"><LikeButton variant="secondary" size="sm" /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="md" /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="lg" /></Stack>

            <span className="text-xs text-muted-foreground">Liked</span>
            <Stack align="center"><LikeButton variant="secondary" size="sm" liked /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="md" liked /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="lg" liked /></Stack>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <Stack align="center"><LikeButton variant="secondary" size="sm" disabled /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="md" disabled /></Stack>
            <Stack align="center"><LikeButton variant="secondary" size="lg" disabled /></Stack>
          </div>
        </Stack>
      </Stack>
    </Stack>
  ),
}

const InteractiveLikeButton = (props: Omit<LikeButtonProps, 'liked' | 'onToggle'>) => {
  const [liked, setLiked] = useState(false)
  return <LikeButton {...props} liked={liked} onToggle={setLiked} />
}

export const Playground: Story = {
  render: () => (
    <Stack gap="xl" className="max-w-md">
      {(['primary', 'secondary'] as const).map((variant) => (
        <Stack key={variant} gap="sm">
          <SectionLabel>{variant}</SectionLabel>
          <Stack direction="row" align="center" gap="lg">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Stack key={size} align="center" gap="xs">
                <InteractiveLikeButton variant={variant} size={size} />
                <SizeLabel>{size}</SizeLabel>
              </Stack>
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  ),
}
