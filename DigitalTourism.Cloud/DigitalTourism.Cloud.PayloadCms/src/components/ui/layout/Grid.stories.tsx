import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from './Grid'

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  parameters: { layout: 'padded' },
  argTypes: {
    cols: { control: 'select', options: [1, 2, 3, 4, 6, 12] },
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-primary-100 text-primary-900 rounded-md px-4 py-6 text-center text-sm font-medium">
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
    <div className="flex flex-col gap-12 max-w-4xl">
      <div>
        <h2 className="text-h4 font-semibold">Grid</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          CSS grid with responsive column variants. Columns adapt at sm and lg breakpoints.
        </p>
      </div>

      {/* Column counts */}
      <div className="flex flex-col gap-6">
        <SectionLabel>Column Variants</SectionLabel>
        {([1, 2, 3, 4, 6] as const).map((cols) => (
          <div key={cols} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">{cols} column{cols > 1 ? 's' : ''}</span>
            <Grid cols={cols} gap="sm">
              {Array.from({ length: cols * 2 }, (_, i) => (
                <Box key={i}>{i + 1}</Box>
              ))}
            </Grid>
          </div>
        ))}
      </div>

      {/* Gap scale */}
      <div className="flex flex-col gap-6">
        <SectionLabel>Gap Scale</SectionLabel>
        {(['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const).map((g) => (
          <div key={g} className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">gap: {g}</span>
            <Grid cols={4} gap={g}>
              <Box>1</Box><Box>2</Box><Box>3</Box><Box>4</Box>
            </Grid>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const Playground: Story = {
  render: (args) => (
    <Grid {...args}>
      <Box>1</Box><Box>2</Box><Box>3</Box>
      <Box>4</Box><Box>5</Box><Box>6</Box>
    </Grid>
  ),
  args: { cols: 3, gap: 'md' },
}
