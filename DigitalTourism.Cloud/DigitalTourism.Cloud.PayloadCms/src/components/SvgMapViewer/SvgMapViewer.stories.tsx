import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SvgMapViewer } from './index'
import { figmaDesign } from '@/components/ui/theme/figma'

// Bulgaria SVG map served from public/ via Storybook staticDirs
const BULGARIA_SVG_URL = '/bg.svg'

// Regions matching the IDs in bg.svg (simplemaps format: BG01–BG28)
const bulgariaRegions = [
  { regionId: 'BG22', name: 'Sofia' },
  { regionId: 'BG16', name: 'Plovdiv' },
  { regionId: 'BG03', name: 'Varna' },
  { regionId: 'BG02', name: 'Burgas' },
  { regionId: 'BG04', name: 'Veliko Tarnovo' },
  { regionId: 'BG24', name: 'Stara Zagora' },
  { regionId: 'BG18', name: 'Ruse' },
  { regionId: 'BG01', name: 'Blagoevgrad' },
  { regionId: 'BG15', name: 'Pleven' },
  { regionId: 'BG08', name: 'Dobrich' },
  { regionId: 'BG23', name: 'Sofia Province' },
  { regionId: 'BG05', name: 'Vidin' },
  { regionId: 'BG12', name: 'Montana' },
  { regionId: 'BG06', name: 'Vratsa' },
  { regionId: 'BG11', name: 'Lovech' },
  { regionId: 'BG07', name: 'Gabrovo' },
  { regionId: 'BG27', name: 'Shumen' },
  { regionId: 'BG17', name: 'Razgrad' },
  { regionId: 'BG25', name: 'Targovishte' },
  { regionId: 'BG19', name: 'Silistra' },
  { regionId: 'BG14', name: 'Pernik' },
  { regionId: 'BG10', name: 'Kyustendil' },
  { regionId: 'BG13', name: 'Pazardzhik' },
  { regionId: 'BG09', name: 'Kardzhali' },
  { regionId: 'BG21', name: 'Smolyan' },
  { regionId: 'BG26', name: 'Haskovo' },
  { regionId: 'BG20', name: 'Sliven' },
  { regionId: 'BG28', name: 'Yambol' },
]

const meta = {
  title: 'Components/SvgMapViewer',
  component: SvgMapViewer,
  parameters: {
    layout: 'centered',
    ...figmaDesign('1340-5381'),
  },
  args: {
    svgUrl: BULGARIA_SVG_URL,
    regions: bulgariaRegions,
    activeRegionId: null,
    hoveredRegionId: null,
    onRegionClick: () => {},
    onRegionHover: () => {},
    defaultFill: '#E6F8F6',
    stroke: '#B8C6C5',
    strokeWidth: '1.5',
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SvgMapViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeRegionId: 'BG22',
  },
}

export const HoveredRegion: Story = {
  args: {
    activeRegionId: 'BG22',
    hoveredRegionId: 'BG16',
  },
}

export const NoActiveRegion: Story = {
  args: {
    activeRegionId: null,
  },
}

const InteractiveMap: React.FC<React.ComponentProps<typeof SvgMapViewer>> = (args) => {
  const [activeId, setActiveId] = React.useState<string | null>('BG22')
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

  return (
    <div className="w-[600px]">
      <SvgMapViewer
        {...args}
        activeRegionId={activeId}
        hoveredRegionId={hoveredId}
        onRegionClick={setActiveId}
        onRegionHover={setHoveredId}
      />
      <div className="mt-4 rounded bg-grey-50 p-3 text-sm">
        <p>
          Active: <strong>{activeId ?? 'none'}</strong>
        </p>
        <p>
          Hovered: <strong>{hoveredId ?? 'none'}</strong>
        </p>
      </div>
    </div>
  )
}

export const Interactive: Story = {
  render: (args) => <InteractiveMap {...args} />,
}

export const OnDarkBackground: Story = {
  args: {
    activeRegionId: 'BG03',
  },
  decorators: [
    (Story) => (
      <div className="w-[600px] rounded-2xl bg-primary-800 p-8">
        <Story />
      </div>
    ),
  ],
}
