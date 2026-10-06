import type { Meta, StoryObj } from '@storybook/react'
import { DeleteRegular, OpenRegular } from '@/components/ui/icons'
import { LinkButton } from './LinkButton'

const meta = {
  title: 'Primitives/LinkButton',
  component: LinkButton,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'dark', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof LinkButton>

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
  args: { href: '#' },
  render: () => (
    <div className="flex flex-col gap-12 max-w-4xl">
      <div>
        <h2 className="text-h4 font-semibold">LinkButton</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Anchor element styled with button variants. Uses next-intl Link for internal routes, native {'<a>'} for external URLs.
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
            <div className="flex justify-center"><LinkButton href="#" variant="primary" size="sm">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="primary" size="md">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="primary" size="lg">Learn more</LinkButton></div>
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
            <div className="flex justify-center"><LinkButton href="#" variant="secondary" size="sm">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="secondary" size="md">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="secondary" size="lg">Learn more</LinkButton></div>
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
            <div className="flex justify-center"><LinkButton href="#" variant="tertiary" size="sm">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="tertiary" size="md">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="tertiary" size="lg">Learn more</LinkButton></div>
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
            <div className="flex justify-center"><LinkButton href="#" variant="dark" size="sm">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="dark" size="md">Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="dark" size="lg">Learn more</LinkButton></div>
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
            <div className="flex justify-center"><LinkButton href="#" variant="destructive" size="sm" icon={<DeleteRegular />}>Delete</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="destructive" size="md" icon={<DeleteRegular />}>Delete</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="destructive" size="lg" icon={<DeleteRegular />}>Delete</LinkButton></div>
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
            <div className="flex justify-center"><LinkButton href="#" variant="link" size="sm" icon={<OpenRegular />}>Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="link" size="md" icon={<OpenRegular />}>Learn more</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="link" size="lg" icon={<OpenRegular />}>Learn more</LinkButton></div>
          </div>
        </div>

        {/* External link */}
        <div className="flex flex-col gap-3">
          <SectionLabel>External (opens in new tab)</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><LinkButton href="https://example.com" variant="primary" size="sm">Visit site</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="https://example.com" variant="secondary" size="md">Visit site</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="https://example.com" variant="link" size="lg" icon={<OpenRegular />}>Visit site</LinkButton></div>
          </div>
        </div>

        {/* No icon */}
        <div className="flex flex-col gap-3">
          <SectionLabel>No icon</SectionLabel>
          <div className="grid grid-cols-[80px_1fr_1fr_1fr] items-center gap-4">
            <span />
            <SizeLabel>Small</SizeLabel>
            <SizeLabel>Medium</SizeLabel>
            <SizeLabel>Large</SizeLabel>

            <span className="text-xs text-muted-foreground">Default</span>
            <div className="flex justify-center"><LinkButton href="#" variant="primary" size="sm" icon={null}>No icon</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="secondary" size="md" icon={null}>No icon</LinkButton></div>
            <div className="flex justify-center"><LinkButton href="#" variant="dark" size="lg" icon={null}>No icon</LinkButton></div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: { children: 'Learn more', href: '#', variant: 'primary', size: 'md' },
}
