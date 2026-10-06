import type { Meta, StoryObj } from '@storybook/react'
import { ArrowUpRightFilled, ChevronRightRegular, DeleteRegular, NavigationRegular, ShareRegular } from '@/components/ui/icons'
import { Button } from './Button'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/IconButton',
  component: Button,
  parameters: { layout: 'padded', ...figmaDesign('1335:10667') },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'dark', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider col-span-full">
    {children}
  </h3>
)

const SizeLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs text-muted-foreground text-center">{children}</span>
)

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-4xl">
      <div>
        <h2 className="text-h4 font-semibold">IconButton</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Circular icon-only buttons using the Button component with <code>iconOnly</code> prop. All sizes, variants, and states.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {/* Primary */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Primary</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="primary" size="sm" iconOnly icon={<ArrowUpRightFilled />} /></div>
            <div className="flex justify-center"><Button variant="primary" size="md" iconOnly icon={<ArrowUpRightFilled />} /></div>
            <div className="flex justify-center"><Button variant="primary" size="lg" iconOnly icon={<ArrowUpRightFilled />} /></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="primary" size="sm" iconOnly icon={<ArrowUpRightFilled />} disabled /></div>
            <div className="flex justify-center"><Button variant="primary" size="md" iconOnly icon={<ArrowUpRightFilled />} disabled /></div>
            <div className="flex justify-center"><Button variant="primary" size="lg" iconOnly icon={<ArrowUpRightFilled />} disabled /></div>
          </div>
        </div>

        {/* Secondary */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Secondary</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="secondary" size="sm" iconOnly icon={<ChevronRightRegular />} /></div>
            <div className="flex justify-center"><Button variant="secondary" size="md" iconOnly icon={<ChevronRightRegular />} /></div>
            <div className="flex justify-center"><Button variant="secondary" size="lg" iconOnly icon={<ChevronRightRegular />} /></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="secondary" size="sm" iconOnly icon={<ChevronRightRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="secondary" size="md" iconOnly icon={<ChevronRightRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="secondary" size="lg" iconOnly icon={<ChevronRightRegular />} disabled /></div>
          </div>
        </div>

        {/* Tertiary */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Tertiary</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="tertiary" size="sm" iconOnly icon={<ShareRegular />} /></div>
            <div className="flex justify-center"><Button variant="tertiary" size="md" iconOnly icon={<ShareRegular />} /></div>
            <div className="flex justify-center"><Button variant="tertiary" size="lg" iconOnly icon={<ShareRegular />} /></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="tertiary" size="sm" iconOnly icon={<ShareRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="tertiary" size="md" iconOnly icon={<ShareRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="tertiary" size="lg" iconOnly icon={<ShareRegular />} disabled /></div>
          </div>
        </div>

        {/* Dark */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Dark</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="dark" size="sm" iconOnly icon={<NavigationRegular />} /></div>
            <div className="flex justify-center"><Button variant="dark" size="md" iconOnly icon={<NavigationRegular />} /></div>
            <div className="flex justify-center"><Button variant="dark" size="lg" iconOnly icon={<NavigationRegular />} /></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="dark" size="sm" iconOnly icon={<NavigationRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="dark" size="md" iconOnly icon={<NavigationRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="dark" size="lg" iconOnly icon={<NavigationRegular />} disabled /></div>
          </div>
        </div>

        {/* Destructive */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Destructive</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="destructive" size="sm" iconOnly icon={<DeleteRegular />} /></div>
            <div className="flex justify-center"><Button variant="destructive" size="md" iconOnly icon={<DeleteRegular />} /></div>
            <div className="flex justify-center"><Button variant="destructive" size="lg" iconOnly icon={<DeleteRegular />} /></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="destructive" size="sm" iconOnly icon={<DeleteRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="destructive" size="md" iconOnly icon={<DeleteRegular />} disabled /></div>
            <div className="flex justify-center"><Button variant="destructive" size="lg" iconOnly icon={<DeleteRegular />} disabled /></div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { variant: 'primary', size: 'md', iconOnly: true, icon: <ArrowUpRightFilled /> },
}
