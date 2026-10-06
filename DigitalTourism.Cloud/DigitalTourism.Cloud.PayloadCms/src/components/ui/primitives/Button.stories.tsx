import type { Meta, StoryObj } from '@storybook/react'
import { DeleteRegular, OpenRegular } from '@/components/ui/icons'
import { Button } from './Button'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'padded', ...figmaDesign('1335:10667') },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'dark', 'destructive', 'link'],
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
        <h2 className="text-h4 font-semibold">Button</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Pill-shaped buttons. Primary uses teal/green-500. All sizes, variants, and states.
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
            <div className="flex justify-center"><Button variant="primary" size="sm">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="primary" size="md">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="primary" size="lg">Primary Button</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="primary" size="sm" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="primary" size="md" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="primary" size="lg" disabled>Primary Button</Button></div>
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
            <div className="flex justify-center"><Button variant="secondary" size="sm">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="secondary" size="md">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="secondary" size="lg">Primary Button</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="secondary" size="sm" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="secondary" size="md" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="secondary" size="lg" disabled>Primary Button</Button></div>
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
            <div className="flex justify-center"><Button variant="tertiary" size="sm">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="tertiary" size="md">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="tertiary" size="lg">Primary Button</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="tertiary" size="sm" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="tertiary" size="md" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="tertiary" size="lg" disabled>Primary Button</Button></div>
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
            <div className="flex justify-center"><Button variant="dark" size="sm">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="dark" size="md">Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="dark" size="lg">Primary Button</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="dark" size="sm" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="dark" size="md" disabled>Primary Button</Button></div>
            <div className="flex justify-center"><Button variant="dark" size="lg" disabled>Primary Button</Button></div>
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
            <div className="flex justify-center"><Button variant="destructive" size="sm" icon={<DeleteRegular />}>Delete</Button></div>
            <div className="flex justify-center"><Button variant="destructive" size="md" icon={<DeleteRegular />}>Delete</Button></div>
            <div className="flex justify-center"><Button variant="destructive" size="lg" icon={<DeleteRegular />}>Delete</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="destructive" size="sm" icon={<DeleteRegular />} disabled>Delete</Button></div>
            <div className="flex justify-center"><Button variant="destructive" size="md" icon={<DeleteRegular />} disabled>Delete</Button></div>
            <div className="flex justify-center"><Button variant="destructive" size="lg" icon={<DeleteRegular />} disabled>Delete</Button></div>
          </div>
        </div>

        {/* Link */}
        <div className="flex flex-col gap-3">
          <SectionLabel>Link</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><Button variant="link" size="sm" icon={<OpenRegular />}>Learn more</Button></div>
            <div className="flex justify-center"><Button variant="link" size="md" icon={<OpenRegular />}>Learn more</Button></div>
            <div className="flex justify-center"><Button variant="link" size="lg" icon={<OpenRegular />}>Learn more</Button></div>

            <span className="text-xs text-muted-foreground">Disabled</span>
            <div className="flex justify-center"><Button variant="link" size="sm" icon={<OpenRegular />} disabled>Learn more</Button></div>
            <div className="flex justify-center"><Button variant="link" size="md" icon={<OpenRegular />} disabled>Learn more</Button></div>
            <div className="flex justify-center"><Button variant="link" size="lg" icon={<OpenRegular />} disabled>Learn more</Button></div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { children: 'Primary Button', variant: 'primary', size: 'md' },
}
