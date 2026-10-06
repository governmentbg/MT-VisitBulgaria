import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'
import { Section } from './Section'

const meta = {
  title: 'Layout/Section',
  component: Section,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col">
      <Section padding="sm" className="bg-muted">
        <Container>
          <h2 className="text-h4 font-semibold">Section</h2>
          <p className="text-body-md text-muted-foreground mt-1">
            Semantic section with vertical padding variants. Each section below shows a different padding size.
          </p>
        </Container>
      </Section>

      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((p, i) => (
        <Section key={p} padding={p} className={i % 2 === 0 ? 'bg-primary-50' : 'bg-background'}>
          <Container>
            <div className="border border-dashed border-primary-300 rounded-md p-4">
              <p className="text-body-sm font-semibold">padding=&quot;{p}&quot;</p>
              <p className="text-body-sm text-muted-foreground mt-1">
                The dashed border shows the content area. The vertical space outside is the section padding.
              </p>
            </div>
          </Container>
        </Section>
      ))}
    </div>
  ),
}

export const Playground: Story = {
  render: (args) => (
    <Section {...args} className="bg-muted">
      <Container>
        <h2 className="font-heading text-h3">Section Title</h2>
        <p className="text-body-md text-muted-foreground mt-2">Section content goes here.</p>
      </Container>
    </Section>
  ),
  args: { padding: 'md' },
}
