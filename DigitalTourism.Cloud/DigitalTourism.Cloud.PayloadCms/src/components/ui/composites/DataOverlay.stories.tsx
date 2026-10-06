import type { Meta, StoryObj } from '@storybook/react'
import { DateOverlay } from './DataOverlay'
import { Stack } from '../layout/Stack'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/DataOverlay',
  component: DateOverlay,
  parameters: { layout: 'padded', ...figmaDesign('1335:10878') },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'bg', 'de', 'fr', 'ru'],
    },
  },
} satisfies Meta<typeof DateOverlay>

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

export const Showcase: Story = {
  args: { date: '2026-02-14' },
  render: () => (
    <Stack gap="2xl" className="max-w-3xl">
      <Stack gap="xs">
        <h2 className="text-h4 font-semibold">DateOverlay</h2>
        <p className="text-body-md text-muted-foreground">
          Date badge showing localized month, day, and year. Used on cards and event overlays.
        </p>
      </Stack>

      <Stack gap="xl">
        <Stack gap="sm">
          <SectionLabel>Locales</SectionLabel>
          <Stack direction="row" gap="lg" wrap>
            {(['en', 'bg', 'de', 'fr', 'ru'] as const).map((locale) => (
              <Stack key={locale} align="center" gap="xs">
                <DateOverlay date="2026-02-14" locale={locale} />
                <span className="text-xs text-muted-foreground">{locale}</span>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <SectionLabel>Different dates</SectionLabel>
          <Stack direction="row" gap="lg" wrap>
            <DateOverlay date="2026-06-21" locale="bg" />
            <DateOverlay date="2026-12-25" locale="bg" />
            <DateOverlay date="2026-01-01" locale="en" />
            <DateOverlay date="2026-08-15" locale="de" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const Playground: Story = {
  args: {
    date: '2026-02-14',
    locale: 'bg',
  },
}
