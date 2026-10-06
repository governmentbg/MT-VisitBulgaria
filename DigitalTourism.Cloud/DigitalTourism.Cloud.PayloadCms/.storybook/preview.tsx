import React from 'react'
import type { Preview } from '@storybook/react'
import { NextIntlClientProvider } from 'next-intl'
import { AuthProvider } from '../src/providers/Auth'
import { HeaderThemeProvider } from '../src/providers/HeaderTheme'
import { FavoritesProvider } from '../src/components/favorites'
import bgMessages from '../src/i18n/messages/bg.json'
import '../src/app/(frontend)/[locale]/globals.css'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      document.documentElement.setAttribute('data-theme', theme)

      return (
        <NextIntlClientProvider locale="bg" messages={bgMessages}>
          <AuthProvider>
            <FavoritesProvider>
              <HeaderThemeProvider>
                <Story />
              </HeaderThemeProvider>
            </FavoritesProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      )
    },
  ],
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    options: {
      storySort: {
        order: ['Blocks', 'Header', 'Components', 'Composites', 'Primitives', 'Layout', 'Styleguide'],
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
    viewport: {
      viewports: {
        /* Matches Tailwind screens: sm 640px, md 1024px, lg 1280px + design target 1920px */
        mobile: { name: 'Mobile (375px)', styles: { width: '375px', height: '812px' } },
        sm: { name: 'sm — Tablet (640px)', styles: { width: '640px', height: '1024px' } },
        md: { name: 'md — Laptop (1024px)', styles: { width: '1024px', height: '768px' } },
        lg: { name: 'lg — Desktop (1280px)', styles: { width: '1280px', height: '800px' } },
        desktop: { name: 'Desktop (1920px)', styles: { width: '1920px', height: '1080px' } },
      },
      defaultViewport: 'desktop',
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'dark', value: '#0D0D12' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
}

export default preview
