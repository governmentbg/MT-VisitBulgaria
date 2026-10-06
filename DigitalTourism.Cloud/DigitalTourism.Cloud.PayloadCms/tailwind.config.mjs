import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'

/** Mobile-landscape variant: landscape orientation on screens narrower than md (1024px) */
const mobileLandscape = plugin(({ addVariant }) => {
  addVariant('mob-ls', '@media (orientation: landscape) and (max-width: 63.999rem)')
})

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  plugins: [tailwindcssAnimate, typography, mobileLandscape],
  prefix: '',
  safelist: [
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:col-span-12',
    'border-border',
    'bg-card',
    'border-error',
    'bg-error/30',
    'border-success',
    'bg-success/30',
    'border-warning',
    'bg-warning/30',
  ],
  theme: {
    screens: {
      sm: '40rem',    /* 640px */
      md: '64rem',    /* 1024px */
      lg: '80rem',    /* 1280px */
      xl: '90rem',    /* 1440px */
    },
    container: {
      center: true,
      padding: {

        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '0rem'
      },
      screens: {
        lg: '1620px',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.25s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.25s ease-out',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        md: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        '3xl': 'var(--shadow-3xl)',
      },
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        heading: 'var(--color-heading)',
        grey: {
          0: 'var(--color-grey-0)',
          25: 'var(--color-grey-25)',
          50: 'var(--color-grey-50)',
          100: 'var(--color-grey-100)',
          200: 'var(--color-grey-200)',
          300: 'var(--color-grey-300)',
          400: 'var(--color-grey-400)',
          500: 'var(--color-grey-500)',
          600: 'var(--color-grey-600)',
          700: 'var(--color-grey-700)',
          800: 'var(--color-grey-800)',
          900: 'var(--color-grey-900)',
        },
        warning: {
          0: 'var(--color-warning-0)',
          25: 'var(--color-warning-25)',
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          DEFAULT: 'var(--color-warning)',
        },
        error: {
          0: 'var(--color-error-0)',
          25: 'var(--color-error-25)',
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          DEFAULT: 'var(--color-error)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
        background: 'var(--color-background)',
        border: 'var(--color-border)',
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        foreground: 'var(--color-foreground)',
        input: 'var(--color-input)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        popover: {
          DEFAULT: 'var(--color-popover)',
          foreground: 'var(--color-popover-foreground)',
        },
        ring: 'var(--color-ring)',
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        success: 'var(--color-success)',
        info: {
          bg: 'var(--color-info-bg)',
          text: 'var(--color-info-text)',
        },
        'status-success': {
          bg: 'var(--color-success-bg)',
          text: 'var(--color-success-text)',
        },
        'status-warning': {
          bg: 'var(--color-warning-bg)',
          text: 'var(--color-warning-text)',
        },
        'status-error': {
          bg: 'var(--color-error-bg)',
          text: 'var(--color-error-text)',
        },
        brand: {
          bg: 'var(--color-brand-bg)',
          text: 'var(--color-brand-text)',
        },
        'button-primary': {
          DEFAULT: 'var(--color-button-primary)',
          hover: 'var(--color-button-primary-hover)',
        },
        countdown: {
          DEFAULT: 'var(--color-countdown)',
          stroke: 'var(--color-countdown-stroke)',
        },
        footer: {
          bg: 'var(--color-footer-bg)',
        },
        'input-field': {
          border: 'var(--color-input-border)',
          placeholder: 'var(--color-input-placeholder)',
          label: 'var(--color-input-label)',
          'focus-ring': 'var(--color-input-focus-ring)',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)'],
        heading: ['var(--font-montserrat-alt)'],
        display: ['var(--font-display)', 'var(--font-montserrat-alt)', 'sans-serif'],
        mono: ['var(--font-geist-mono)'],
      },
      fontSize: {
        h1: ['6.25rem', { lineHeight: '105%', fontWeight: '700' }],
        h2: ['3.75rem', { lineHeight: '115%', fontWeight: '700' }],
        h3: ['2.5rem', { lineHeight: '110%', fontWeight: '700' }],
        h4: ['1.5rem', { lineHeight: '130%', fontWeight: '500' }],
        tagline: ['1.25rem', { lineHeight: '120%', fontWeight: '600' }],
        'heading-card': ['1.25rem', { lineHeight: '130%', fontWeight: '700' }],
        'body-lg': ['1.125rem', { lineHeight: '150%', fontWeight: '500' }],
        'body-md': ['1rem', { lineHeight: '150%', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '140%', fontWeight: '500' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(30%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-30%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              'h1, h2, h3, h4': {
                fontFamily: 'var(--font-montserrat-alt)',
              },
              h1: {
                fontSize: '3.75rem',
                fontWeight: '700',
                lineHeight: '105%',
                marginBottom: '0.25em',
              },
              h2: {
                fontSize: '2.5rem',
                fontWeight: '700',
                lineHeight: '115%',
              },
              h3: {
                fontSize: '1.75rem',
                fontWeight: '700',
                lineHeight: '110%',
              },
              h4: {
                fontSize: '1.5rem',
                fontWeight: '500',
                lineHeight: '130%',
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '6.25rem',
              },
              h2: {
                fontSize: '3.75rem',
              },
              h3: {
                fontSize: '2.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
