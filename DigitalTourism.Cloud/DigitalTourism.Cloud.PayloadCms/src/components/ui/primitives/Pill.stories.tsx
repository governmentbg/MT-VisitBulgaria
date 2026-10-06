import type { Meta, StoryObj } from '@storybook/react'
import { Pill } from './Pill'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/Pill',
  component: Pill,
  parameters: { layout: 'padded', ...figmaDesign('1335:10799') },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'brand', 'success', 'warning', 'error', 'info', 'primary', 'secondary', 'destructive', 'outline'],
    },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider col-span-full">
    {children}
  </h3>
)

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-10 max-w-3xl">
      <div>
        <h2 className="text-h4 font-semibold">Pill</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Full-round pills with 6 styles and 4 sizes.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <SectionLabel>Status Variants</SectionLabel>
        <div className="grid grid-cols-[100px_1fr_1fr_1fr_1fr] items-center gap-4">
          <span />
          <span className="text-xs text-muted-foreground text-center">Small</span>
          <span className="text-xs text-muted-foreground text-center">Medium</span>
          <span className="text-xs text-muted-foreground text-center">Large</span>
          <span className="text-xs text-muted-foreground text-center">XL</span>

          <span className="text-xs text-muted-foreground">Default</span>
          <div className="text-center"><Pill variant="default" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="default" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="default" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="default" size="xl">Label</Pill></div>

          <span className="text-xs text-muted-foreground">Brand</span>
          <div className="text-center"><Pill variant="brand" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="brand" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="brand" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="brand" size="xl">Label</Pill></div>

          <span className="text-xs text-muted-foreground">Success</span>
          <div className="text-center"><Pill variant="success" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="success" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="success" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="success" size="xl">Label</Pill></div>

          <span className="text-xs text-muted-foreground">Warning</span>
          <div className="text-center"><Pill variant="warning" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="warning" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="warning" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="warning" size="xl">Label</Pill></div>

          <span className="text-xs text-muted-foreground">Error</span>
          <div className="text-center"><Pill variant="error" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="error" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="error" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="error" size="xl">Label</Pill></div>

          <span className="text-xs text-muted-foreground">Info</span>
          <div className="text-center"><Pill variant="info" size="sm">Label</Pill></div>
          <div className="text-center"><Pill variant="info" size="md">Label</Pill></div>
          <div className="text-center"><Pill variant="info" size="lg">Label</Pill></div>
          <div className="text-center"><Pill variant="info" size="xl">Label</Pill></div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { children: 'Pill', variant: 'default', size: 'md' },
}
