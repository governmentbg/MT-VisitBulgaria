import type { Meta, StoryObj } from '@storybook/react'
import { PersonRegular, HeartRegular, SettingsRegular, FlowRegular } from '@/components/ui/icons'
import { AuthOverlay } from './AuthOverlay'
import { figmaDesign } from '../../theme/figma'

const meta = {
  title: 'Composites/Navigation/AuthOverlay',
  component: AuthOverlay,
  parameters: { layout: 'padded', ...figmaDesign('1335:9662') },
  argTypes: {
    mode: { control: 'select', options: ['login', 'register', 'account'] },
  },
} satisfies Meta<typeof AuthOverlay>

export default meta
type Story = StoryObj<typeof meta>

const accountMenuItems = [
  { label: 'Любими', icon: <HeartRegular />, href: '#' },
  { label: 'Моите пътувания', icon: <FlowRegular />, href: '#' },
  { label: 'Моят акаунт', icon: <PersonRegular />, href: '#' },
  { label: 'Настройки', icon: <SettingsRegular />, href: '#' },
]

export const Showcase: Story = {
  args: { mode: 'login' },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-h4 font-semibold">AuthOverlay</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Login, register, and account overlay panels.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 items-start">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Login</span>
          <AuthOverlay
            mode="login"
            onSubmit={(data) => console.log(data)}
            onSwitch={() => {}}
            onSocialLogin={() => {}}
            onForgotPassword={() => {}}
            onClose={() => {}}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Register</span>
          <AuthOverlay
            mode="register"
            onSubmit={(data) => console.log(data)}
            onSwitch={() => {}}
            onSocialLogin={() => {}}
            onClose={() => {}}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground">Account</span>
          <AuthOverlay
            mode="account"
            userEmail="ExampleTest@gmail.com"
            accountMenuItems={accountMenuItems}
            onLogout={() => {}}
            onClose={() => {}}
          />
        </div>
      </div>
    </div>
  ),
}

export const Playground: Story = {
  args: {
    mode: 'login',
    onSubmit: () => {},
    onSwitch: () => {},
    onSocialLogin: () => {},
    onForgotPassword: () => {},
    onClose: () => {},
  },
}
