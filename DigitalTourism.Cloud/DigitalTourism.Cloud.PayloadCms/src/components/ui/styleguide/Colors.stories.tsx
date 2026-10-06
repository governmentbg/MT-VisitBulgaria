import type { Meta, StoryObj } from '@storybook/react'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Styleguide/Colors',
  parameters: { layout: 'fullscreen', ...figmaDesign('521:151') },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-body-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h3>
)

type SwatchProps = {
  label: string
  hex: string
  className: string
}

const Swatch = ({ label, hex, className }: SwatchProps) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-20 h-20 rounded-lg border border-grey-200 ${className}`} />
    <span className="text-xs font-medium text-foreground">{label}</span>
    <span className="text-xs text-muted-foreground font-mono">{hex}</span>
  </div>
)

type PaletteProps = {
  title: string
  swatches: SwatchProps[]
  usageExamples: { label: string; code: string }[]
}

const Palette = ({ title, swatches, usageExamples }: PaletteProps) => (
  <div className="flex flex-col gap-4">
    <SectionLabel>{title}</SectionLabel>
    <div className="flex flex-wrap gap-4">
      {swatches.map((swatch) => (
        <Swatch key={swatch.label} {...swatch} />
      ))}
    </div>
    <div className="flex flex-wrap gap-3 mt-2">
      {usageExamples.map((ex) => (
        <code
          key={ex.label}
          className="text-xs bg-grey-50 text-grey-700 px-2 py-1 rounded"
        >
          {ex.code}
        </code>
      ))}
    </div>
  </div>
)

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-8 max-w-5xl">
      <div>
        <h2 className="text-h4 font-heading font-semibold">Colors</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Design system color palette. Each swatch uses its Tailwind utility class.
        </p>
      </div>

      {/* Primary - Green */}
      <Palette
        title="Primary - Green"
        swatches={[
          { label: '50', hex: '#E6F8F6', className: 'bg-primary-50' },
          { label: '100', hex: '#B0EAE4', className: 'bg-primary-100' },
          { label: '300', hex: '#54D1C4', className: 'bg-primary-300' },
          { label: '500', hex: '#00BBA7', className: 'bg-primary-500' },
          { label: '700', hex: '#008577', className: 'bg-primary-700' },
          { label: '900', hex: '#004F46', className: 'bg-primary-900' },
        ]}
        usageExamples={[
          { label: 'text', code: 'text-primary-500' },
          { label: 'bg', code: 'bg-primary-500' },
          { label: 'border', code: 'border-primary-500' },
        ]}
      />

      {/* Greyscale */}
      <Palette
        title="Greyscale"
        swatches={[
          { label: '0', hex: '#F8F9FB', className: 'bg-grey-0' },
          { label: '25', hex: '#F6F8FA', className: 'bg-grey-25' },
          { label: '50', hex: '#ECEFF3', className: 'bg-grey-50' },
          { label: '100', hex: '#DFE1E6', className: 'bg-grey-100' },
          { label: '200', hex: '#C1C7CF', className: 'bg-grey-200' },
          { label: '300', hex: '#A4ABB8', className: 'bg-grey-300' },
          { label: '400', hex: '#808897', className: 'bg-grey-400' },
          { label: '500', hex: '#666D80', className: 'bg-grey-500' },
          { label: '600', hex: '#353849', className: 'bg-grey-600' },
          { label: '700', hex: '#272835', className: 'bg-grey-700' },
          { label: '800', hex: '#1A1B25', className: 'bg-grey-800' },
          { label: '900', hex: '#0D0D12', className: 'bg-grey-900' },
        ]}
        usageExamples={[
          { label: 'text', code: 'text-grey-900' },
          { label: 'bg', code: 'bg-grey-50' },
          { label: 'border', code: 'border-grey-200' },
        ]}
      />

      {/* Alert / Warning */}
      <Palette
        title="Alert / Warning"
        swatches={[
          { label: '0', hex: '#FFF6E0', className: 'bg-warning-0' },
          { label: '25', hex: '#F9ECCB', className: 'bg-warning-25' },
          { label: '50', hex: '#FBD982', className: 'bg-warning-50' },
          { label: '100', hex: '#FFBD4C', className: 'bg-warning-100' },
          { label: '200', hex: '#956321', className: 'bg-warning-200' },
          { label: '300', hex: '#5B3D1E', className: 'bg-warning-300' },
        ]}
        usageExamples={[
          { label: 'text', code: 'text-warning-200' },
          { label: 'bg', code: 'bg-warning-0' },
          { label: 'border', code: 'border-warning-100' },
        ]}
      />

      {/* Alert / Error */}
      <Palette
        title="Alert / Error"
        swatches={[
          { label: '0', hex: '#FEEFF2', className: 'bg-error-0' },
          { label: '25', hex: '#FADAE1', className: 'bg-error-25' },
          { label: '50', hex: '#ED8296', className: 'bg-error-50' },
          { label: '100', hex: '#DF1C41', className: 'bg-error-100' },
          { label: '200', hex: '#95122B', className: 'bg-error-200' },
          { label: '300', hex: '#710E21', className: 'bg-error-300' },
        ]}
        usageExamples={[
          { label: 'text', code: 'text-error-100' },
          { label: 'bg', code: 'bg-error-0' },
          { label: 'border', code: 'border-error-100' },
        ]}
      />
    </div>
  ),
}
