import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AuthDialog } from './index'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ResetSentView } from './ResetSentView'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  CloseButton,
} from '@/components/ui'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useTranslations } from 'next-intl'

const meta = {
  title: 'Components/AuthDialog',
  component: AuthDialog,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuthDialog>

export default meta
type Story = StoryObj<typeof meta>

// Helper wrapper that renders a sub-component inside the AuthDialog visual shell
const AuthDialogShell: React.FC<{
  titleKey: string
  descriptionKey?: string
  children: React.ReactNode
}> = ({ titleKey, descriptionKey, children }) => {
  const t = useTranslations('auth')
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        hideCloseButton
        className="inset-0 translate-x-0 translate-y-0 max-w-none rounded-none p-6 gap-0 overflow-y-auto overscroll-contain border-none lg:inset-auto lg:left-[50%] lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:max-w-[448px] lg:max-h-[90dvh] lg:rounded-[30px] lg:p-8 lg:shadow-2xl"
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-start gap-2">
            <DialogHeader className="flex-1 space-y-1">
              <DialogTitle className="text-xl font-bold font-heading leading-[1.3] text-grey-900">
                {t(titleKey)}
              </DialogTitle>
              {descriptionKey && (
                <DialogDescription className="text-body-sm text-grey-500">
                  {t(descriptionKey)}
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogPrimitive.Close asChild>
              <CloseButton size="sm" className="shrink-0" />
            </DialogPrimitive.Close>
          </div>
          <div>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const LoginView: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    defaultView: 'login',
  },
}

export const RegisterView: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    defaultView: 'register',
  },
}

export const ForgotPasswordView: Story = {
  args: { open: true, onOpenChange: () => {} },
  render: () => (
    <AuthDialogShell titleKey="resetPasswordTitle" descriptionKey="resetPasswordDescription">
      <ForgotPasswordForm />
    </AuthDialogShell>
  ),
}

export const ResetSentViewStory: Story = {
  name: 'Reset Sent View',
  args: { open: true, onOpenChange: () => {} },
  render: () => (
    <AuthDialogShell titleKey="checkYourEmail">
      <ResetSentView />
    </AuthDialogShell>
  ),
}

export const Showcase: Story = {
  args: { open: true, onOpenChange: () => {} },
  parameters: { layout: 'padded' },
  render: () => (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-h4 font-semibold">AuthDialog</h2>
        <p className="text-body-md text-muted-foreground mt-1">
          Login, register, forgot password, and reset confirmation views.
        </p>
      </div>

      <div className="flex flex-wrap gap-8 items-start">
        <DialogPanel titleKey="signInTitle" descriptionKey="signInDescription">
          <LoginForm />
        </DialogPanel>

        <DialogPanel titleKey="createAccountTitle" descriptionKey="createAccountDescription">
          <RegisterForm />
        </DialogPanel>

        <DialogPanel titleKey="resetPasswordTitle" descriptionKey="resetPasswordDescription">
          <ForgotPasswordForm />
        </DialogPanel>

        <DialogPanel titleKey="checkYourEmail">
          <ResetSentView />
        </DialogPanel>
      </div>
    </div>
  ),
}

// Standalone panel for Showcase (no portal/overlay)
const DialogPanel: React.FC<{
  titleKey: string
  descriptionKey?: string
  children: React.ReactNode
}> = ({ titleKey, descriptionKey, children }) => {
  const t = useTranslations('auth')
  return (
    <div className="w-[448px] rounded-[30px] p-8 bg-background shadow-2xl border border-border/10">
      <div className="flex flex-col gap-8">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-heading leading-[1.3] text-grey-900">
            {t(titleKey)}
          </h3>
          {descriptionKey && (
            <p className="text-body-sm text-grey-500">{t(descriptionKey)}</p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
