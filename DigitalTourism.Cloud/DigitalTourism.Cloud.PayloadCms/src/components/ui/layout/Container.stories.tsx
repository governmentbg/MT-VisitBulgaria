import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-0">
      <div className="bg-muted py-8">
        <Container>
          <h2 className="text-h4 font-semibold">Container</h2>
          <p className="text-body-md text-muted-foreground mt-1">
            Max-width wrapper matching the Tailwind container config. Centers content with responsive horizontal padding.
          </p>
        </Container>
      </div>

      {/* Visual demo — container vs full width */}
      <div className="bg-error-0 py-4">
        <p className="text-center text-xs text-error-200">Full width (no container)</p>
      </div>
      <div className="bg-primary-50 py-4">
        <Container>
          <p className="text-center text-xs text-primary-700">Inside Container</p>
        </Container>
      </div>
      <div className="bg-error-0 py-4">
        <p className="text-center text-xs text-error-200">Full width (no container)</p>
      </div>
      <div className="bg-primary-50 py-4">
        <Container>
          <p className="text-center text-xs text-primary-700">Inside Container</p>
        </Container>
      </div>
    </div>
  ),
}
