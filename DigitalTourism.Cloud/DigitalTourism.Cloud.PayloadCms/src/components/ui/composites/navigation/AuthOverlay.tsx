'use client'

import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'
import { Button } from '../../primitives/Button'
import { Input } from '../../primitives/Input'
import { CloseButton } from '../../primitives/CloseButton'
import { FormField } from '../FormField'

export interface AuthAccountMenuItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
}

export interface AuthOverlayProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
  mode: 'login' | 'register' | 'account'
  onSubmit?: (data: Record<string, string>) => void
  onSwitch?: (mode: 'login' | 'register') => void
  onSocialLogin?: (provider: 'google' | 'facebook' | 'apple') => void
  onLogout?: () => void
  onForgotPassword?: () => void
  onClose?: () => void
  userEmail?: string
  accountMenuItems?: AuthAccountMenuItem[]
  ref?: React.Ref<HTMLDivElement>
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({
  mode,
  onSubmit,
  onSwitch,
  onSocialLogin,
  onLogout,
  onForgotPassword,
  onClose,
  userEmail,
  accountMenuItems = [],
  className,
  ref,
  ...props
}) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })
    onSubmit?.(data)
  }

  /* ── Account menu overlay ── */
  if (mode === 'account') {
    return (
      <div
        className={cn(
          'flex w-96 flex-col gap-6 rounded-[30px] bg-white shadow-2xl font-sans',
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* Header */}
        <div className="relative px-9 pt-6">
          {userEmail && (
            <p className="text-base font-medium text-grey-900 pr-8">{userEmail}</p>
          )}
          {onClose && (
            <CloseButton size="sm" onClose={onClose} className="absolute right-5 top-6" />
          )}
        </div>

        {/* Menu items */}
        <div className="flex flex-col gap-2 px-5">
          {accountMenuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className="flex h-14 items-center gap-4 rounded-[10px] px-4 text-body-sm font-medium text-grey-900 transition-colors hover:bg-grey-25"
            >
              {item.icon && (
                <span className="flex shrink-0 items-center text-grey-900 [&_svg]:h-5 [&_svg]:w-5">
                  {item.icon}
                </span>
              )}
              {item.label}
            </a>
          ))}
        </div>

        {/* Logout button */}
        {onLogout && (
          <div className="flex justify-center px-5 pb-6">
            <Button
              variant="primary"
              icon={null}
              size="xs"
              className="w-[304px]"
              onClick={onLogout}
            >
              Изход
            </Button>
          </div>
        )}
      </div>
    )
  }

  /* ── Login / Register overlay ── */
  return (
    <div
      className={cn(
        'flex w-[448px] flex-col gap-8 rounded-[30px] bg-white p-8 shadow-2xl font-sans',
        className,
      )}
      ref={ref}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="text-xl font-bold font-heading leading-[1.3] text-grey-900">
            {mode === 'login' ? 'Влезте в профила си' : 'Създайте акаунт'}
          </h3>
          <p className="text-body-sm text-grey-500">
            Попълнете информацията долу, за да влезете в акаунта си
          </p>
        </div>
        {onClose && <CloseButton size="sm" onClose={onClose} className="shrink-0" />}
      </div>

      {/* Form + Divider + Social */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-10">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <FormField label="Имейл" name="email">
                <Input name="email" type="email" placeholder="име@пример.com" />
              </FormField>

              <div className="flex flex-col gap-3">
                <FormField label="Парола" name="password">
                  <Input name="password" type="password" placeholder="Въведете паролата си" />
                </FormField>
                {mode === 'login' && onForgotPassword && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="self-end text-xs font-medium text-primary underline hover:text-primary-600"
                  >
                    Забравена парола?
                  </button>
                )}
                {mode === 'register' && (
                  <p className="text-xs font-medium text-error-100">
                    Изискват се минимум 8 символа
                  </p>
                )}
              </div>

              {mode === 'register' && (
                <FormField label="Потвърдете паролата си" name="confirmPassword">
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Потвърдете паролата си"
                  />
                </FormField>
              )}
            </div>

            <Button type="submit" variant="primary" size="xs" icon={null} className="w-full">
              {mode === 'login' ? 'Влез' : 'Регистрация'}
            </Button>
          </form>

          {/* Divider */}
          {onSocialLogin && (
            <div className="flex items-center gap-0">
              <div className="h-px flex-1 bg-grey-100" />
              <span className="bg-white px-2.5 text-body-sm text-grey-500">Продължете със</span>
              <div className="h-px flex-1 bg-grey-100" />
            </div>
          )}
        </div>

        {/* Social buttons */}
        {onSocialLogin && (
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => onSocialLogin('google')}
              className="flex h-12 w-full items-center justify-center gap-4 rounded-full border border-grey-200 bg-white text-body-sm font-medium text-grey-900 transition-colors hover:bg-grey-25"
            >
              Продължете с Google
            </button>
            <button
              type="button"
              onClick={() => onSocialLogin('facebook')}
              className="flex h-12 w-full items-center justify-center gap-4 rounded-full bg-[#1877F2] text-body-sm font-medium text-white transition-colors hover:bg-[#166FE5]"
            >
              Продължете с Facebook
            </button>
            <button
              type="button"
              onClick={() => onSocialLogin('apple')}
              className="flex h-12 w-full items-center justify-center gap-4 rounded-full bg-black text-body-sm font-medium text-white transition-colors hover:bg-grey-900"
            >
              Продължете с Apple
            </button>
          </div>
        )}
      </div>

      {/* Switch mode link */}
      {onSwitch && (
        <div className="flex items-center justify-center gap-2.5">
          <p className="text-xs font-medium text-grey-600">
            {mode === 'login' ? 'Все още нямате акаунт?' : 'Вече имате акаунт?'}
          </p>
          <button
            type="button"
            onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-semibold text-primary-700 underline hover:text-primary-600"
          >
            {mode === 'login' ? 'Създайте акаунт' : 'Вход'}
          </button>
        </div>
      )}
    </div>
  )
}

export { AuthOverlay }
