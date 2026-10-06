import type { Meta, StoryObj } from '@storybook/react'
import { CloudRegular, WeatherSunnyRegular, WeatherRainRegular } from '@/components/ui/icons'
import { WeatherElement } from './WeatherElement'
import { figmaDesign } from '../theme/figma'

const meta = {
  title: 'Composites/WeatherElement',
  component: WeatherElement,
  parameters: { layout: 'padded', ...figmaDesign('1335:9633') },
} satisfies Meta<typeof WeatherElement>

export default meta
type Story = StoryObj<typeof meta>

export const Showcase: Story = {
  args: { city: '', temperature: 0 },
  render: () => (
    <div className="flex flex-col gap-10 max-w-lg">
      <div>
        <h2 className="text-h4 font-semibold">WeatherElement</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Compact weather display widget for the map interface.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <WeatherElement
          city="Sofia"
          temperature={-2}
          humidity={82}
          humidityLabel="humidity"
          conditionIcon={<CloudRegular />}
        />

        <WeatherElement
          city="Burgas"
          temperature={8}
          humidity={60}
          humidityLabel="humidity"
          conditionIcon={<WeatherSunnyRegular />}
        />

        <WeatherElement
          city="Plovdiv"
          temperature={3}
          unit="C"
          humidity={90}
          humidityLabel="humidity"
          conditionIcon={<WeatherRainRegular />}
        />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    city: 'Sofia',
    temperature: -2,
    unit: 'C',
    humidity: 75,
    humidityLabel: 'humidity',
  },
}
