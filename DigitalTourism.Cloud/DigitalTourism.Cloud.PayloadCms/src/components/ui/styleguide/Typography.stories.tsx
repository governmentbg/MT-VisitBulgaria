import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Styleguide/Typography',
  parameters: { layout: 'fullscreen', ...figmaDesign('593:4055') },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

type SpecLabelProps = {
  family: string
  size: string
  weight: string
  lineHeight: string
}

const SpecLabel = ({ family, size, weight, lineHeight }: SpecLabelProps) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {[family, size, weight, `LH ${lineHeight}`].map((spec) => (
      <code key={spec} className="text-xs bg-grey-50 text-grey-700 px-2 py-1 rounded">
        {spec}
      </code>
    ))}
  </div>
)

type TypeSampleProps = {
  label: string
  className: string
  sampleText: string
  spec: SpecLabelProps
}

const TypeSample = ({ label, className, sampleText, spec }: TypeSampleProps) => (
  <div className="flex flex-col gap-2 pb-6 border-b border-grey-100 last:border-0">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
    <p className={className}>{sampleText}</p>
    <SpecLabel {...spec} />
  </div>
)

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8 max-w-5xl">
      <div>
        <h2 className="text-h4 font-heading font-semibold">Typography</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Design system type scale. Each sample uses its Tailwind utility class.
        </p>
      </div>

      {/* Headings */}
      <div className="flex flex-col gap-6">
        <SectionLabel>Headings</SectionLabel>

        <TypeSample
          label="h1 — text-h1 font-heading"
          className="text-h1 font-heading"
          sampleText="Heading 1"
          spec={{
            family: 'Montserrat Alternates',
            size: '6.25rem / 100px',
            weight: 'Bold (700)',
            lineHeight: '105%',
          }}
        />

        <TypeSample
          label="h2 — text-h2 font-heading"
          className="text-h2 font-heading"
          sampleText="Heading 2"
          spec={{
            family: 'Montserrat Alternates',
            size: '3.75rem / 60px',
            weight: 'Bold (700)',
            lineHeight: '115%',
          }}
        />

        <TypeSample
          label="h3 — text-h3 font-heading"
          className="text-h3 font-heading"
          sampleText="Heading 3"
          spec={{
            family: 'Montserrat Alternates',
            size: '2.5rem / 40px',
            weight: 'Bold (700)',
            lineHeight: '110%',
          }}
        />

        <TypeSample
          label="h4 — text-h4 font-heading"
          className="text-h4 font-heading"
          sampleText="Heading 4"
          spec={{
            family: 'Montserrat Alternates',
            size: '1.5rem / 24px',
            weight: 'Medium (500)',
            lineHeight: '130%',
          }}
        />

        <TypeSample
          label="tagline — text-tagline font-heading"
          className="text-tagline font-heading"
          sampleText="Tagline Text"
          spec={{
            family: 'Montserrat Alternates',
            size: '1.25rem / 20px',
            weight: 'SemiBold (600)',
            lineHeight: '120%',
          }}
        />

        <TypeSample
          label="heading-card — text-heading-card font-heading"
          className="text-heading-card font-heading"
          sampleText="Heading Card"
          spec={{
            family: 'Montserrat Alternates',
            size: '1.25rem / 20px',
            weight: 'Bold (700)',
            lineHeight: '130%',
          }}
        />
      </div>

      {/* Body Text */}
      <div className="flex flex-col gap-6">
        <SectionLabel>Body Text</SectionLabel>

        <TypeSample
          label="body-lg — text-body-lg"
          className="text-body-lg"
          sampleText="Body Large — The quick brown fox jumps over the lazy dog. This is a sample paragraph to demonstrate the body large text style used throughout the application."
          spec={{
            family: 'Montserrat',
            size: '1.125rem / 18px',
            weight: 'Medium (500)',
            lineHeight: '150%',
          }}
        />

        <TypeSample
          label="body-md — text-body-md"
          className="text-body-md"
          sampleText="Body Medium — The quick brown fox jumps over the lazy dog. This is a sample paragraph to demonstrate the body medium text style, the default for most content."
          spec={{
            family: 'Montserrat',
            size: '1rem / 16px',
            weight: 'Regular (400)',
            lineHeight: '150%',
          }}
        />

        <TypeSample
          label="body-sm — text-body-sm"
          className="text-body-sm"
          sampleText="Body Small — The quick brown fox jumps over the lazy dog. This is a sample paragraph to demonstrate the body small text style used for captions and secondary content."
          spec={{
            family: 'Montserrat',
            size: '0.875rem / 14px',
            weight: 'Medium (500)',
            lineHeight: '140%',
          }}
        />
      </div>
    </div>
  ),
}
