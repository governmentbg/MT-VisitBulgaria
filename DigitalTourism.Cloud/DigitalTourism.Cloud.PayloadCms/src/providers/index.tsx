'use client'

import React from 'react'
import dynamic from 'next/dynamic'

import { AuthProvider, useAuth } from './Auth'
import { HeaderThemeProvider } from './HeaderTheme'
import { AlternateUrlsProvider } from './AlternateUrls'
import { ThemeProvider } from './Theme'
import { WeatherSettingsProvider } from '@/plugins/weather/context'
import { FavoritesProvider } from '@/components/favorites/FavoritesProvider'

const LazyAuthDialog = dynamic(
  () => import('@/components/AuthDialog').then((m) => ({ default: m.AuthDialog })),
  { ssr: false },
)

/**
 * AuthDialogWrapper - Only renders when the dialog is open, deferring the entire
 * auth form component tree until the user clicks sign in.
 */
const AuthDialogWrapper: React.FC = () => {
  const { isAuthDialogOpen, closeAuthDialog, authDialogView, refreshVisitor } = useAuth()

  if (!isAuthDialogOpen) return null

  return (
    <LazyAuthDialog
      open={isAuthDialogOpen}
      onOpenChange={(open) => {
        if (!open) closeAuthDialog()
      }}
      defaultView={authDialogView}
      onSuccess={() => {
        refreshVisitor()
      }}
    />
  )
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AlternateUrlsProvider>
          <AuthProvider>
            <FavoritesProvider>
            <WeatherSettingsProvider>
              {children}
              <AuthDialogWrapper />
            </WeatherSettingsProvider>
            </FavoritesProvider>
          </AuthProvider>
        </AlternateUrlsProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
