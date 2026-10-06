export type NavTheme = 'solid' | 'transparent-light' | 'transparent-dark'

export const navThemeConfig = {
  solid: {
    headerClass: 'bg-white shadow-sm',
    logoVariant: 'dark' as const,
    logoSize: 'default' as const,
    textColor: 'text-grey-600',
    tabClass: 'hover:opacity-80',
    tabActiveClass: 'opacity-80',
    iconButtonVariant: 'secondary' as const,
    langSwitcherClosed: 'bg-grey-100 text-grey-600 hover:bg-grey-200',
  },
  'transparent-light': {
    headerClass: '',
    logoVariant: 'light' as const,
    logoSize: 'large' as const,
    textColor: 'text-white',
    tabClass: 'nav-tab-pill hover:before:bg-white/20',
    tabActiveClass: 'nav-tab-pill before:bg-white text-grey-900',
    iconButtonVariant: 'ghost' as const,
    langSwitcherClosed: 'bg-grey-50 text-grey-600 hover:bg-grey-200',
  },
  'transparent-dark': {
    headerClass: '',
    logoVariant: 'dark' as const,
    logoSize: 'large' as const,
    textColor: 'text-grey-900',
    tabClass: 'nav-tab-pill hover:before:bg-black/10',
    tabActiveClass: 'nav-tab-pill before:bg-white text-grey-900',
    iconButtonVariant: 'ghost' as const,
    langSwitcherClosed: 'bg-grey-50 text-grey-600 hover:bg-grey-200',
  },
} as const satisfies Record<
  NavTheme,
  {
    headerClass: string
    logoVariant: 'dark' | 'light'
    logoSize: 'default' | 'large'
    textColor: string
    tabClass: string
    tabActiveClass: string
    iconButtonVariant: 'secondary' | 'ghost'
    langSwitcherClosed: string
  }
>
