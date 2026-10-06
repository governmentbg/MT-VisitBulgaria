import type { Meta, StoryObj } from '@storybook/react'
import { NavigationBar } from './NavigationBar'
import { figmaDesign } from '../../theme/figma'

const meta = {
  title: 'Composites/Navigation/NavigationBar',
  component: NavigationBar,
  parameters: { layout: 'fullscreen', ...figmaDesign('1335:9662') },
} satisfies Meta<typeof NavigationBar>

export default meta
type Story = StoryObj<typeof meta>

const menuItems = [
  { label: 'Destinations', href: '#' },
  { label: 'Activities', href: '#' },
  { label: 'Culture', href: '#' },
  { label: 'Events', href: '#' },
]

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="p-6">
        <h2 className="text-h4 font-semibold">NavigationBar</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Top navigation bar with menu items and user actions.
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t">
        <p className="text-xs text-muted-foreground px-6 pt-4">Logged out</p>
        <NavigationBar
          menuItems={menuItems}
          onLogin={() => {}}
          onSearch={() => {}}
          currentLocale="bg"
          onLocaleChange={() => {}}
        />

        <p className="text-xs text-muted-foreground px-6 pt-4 border-t">Logged in</p>
        <NavigationBar
          menuItems={menuItems}
          isLoggedIn
          onSearch={() => {}}
          currentLocale="en"
          onLocaleChange={() => {}}
        />
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    menuItems,
    onLogin: () => {},
    onSearch: () => {},
    currentLocale: 'bg',
    onLocaleChange: () => {},
  },
}
