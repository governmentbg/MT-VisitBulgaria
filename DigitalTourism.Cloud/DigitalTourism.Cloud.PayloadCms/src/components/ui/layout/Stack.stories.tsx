import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from './Stack'

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: { layout: 'padded' },
  argTypes: {
    direction: { control: 'select', options: ['column', 'row', 'column-reverse', 'row-reverse'] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-primary-100 text-primary-900 rounded-md px-4 py-3 text-sm font-medium ${className}`}>
    {children}
  </div>
)

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-3xl">
      <div>
        <h2 className="text-h4 font-semibold">Stack</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Flex container with direction, gap, alignment, and justification variants.
        </p>
      </div>

      {/* Direction */}
      <div className="flex flex-col gap-4">
        <SectionLabel>Direction</SectionLabel>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Column</span>
            <Stack direction="column" gap="sm" className="p-4 border border-border rounded-md">
              <Box>1</Box><Box>2</Box><Box>3</Box>
            </Stack>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Row</span>
            <Stack direction="row" gap="sm" className="p-4 border border-border rounded-md">
              <Box>1</Box><Box>2</Box><Box>3</Box>
            </Stack>
          </div>
        </div>
      </div>

      {/* Gap scale */}
      <div className="flex flex-col gap-4">
        <SectionLabel>Gap Scale</SectionLabel>
        <div className="flex flex-col gap-4">
          {(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((g) => (
            <div key={g} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-10">{g}</span>
              <Stack direction="row" gap={g} className="p-3 border border-border rounded-md flex-1">
                <Box>A</Box><Box>B</Box><Box>C</Box>
              </Stack>
            </div>
          ))}
        </div>
      </div>

      {/* Justify */}
      <div className="flex flex-col gap-4">
        <SectionLabel>Justify</SectionLabel>
        <div className="flex flex-col gap-4">
          {(['start', 'center', 'end', 'between', 'around', 'evenly'] as const).map((j) => (
            <div key={j} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-16">{j}</span>
              <Stack direction="row" gap="sm" justify={j} className="p-3 border border-border rounded-md flex-1">
                <Box>A</Box><Box>B</Box><Box>C</Box>
              </Stack>
            </div>
          ))}
        </div>
      </div>

      {/* Align */}
      <div className="flex flex-col gap-4">
        <SectionLabel>Align</SectionLabel>
        <div className="flex flex-col gap-4">
          {(['start', 'center', 'end', 'stretch'] as const).map((a) => (
            <div key={a} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-16">{a}</span>
              <Stack direction="row" gap="sm" align={a} className="p-3 border border-border rounded-md flex-1 min-h-[80px]">
                <Box>Short</Box><Box className="py-6">Tall</Box><Box>Short</Box>
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
  args: { direction: 'column', gap: 'md' },
}
