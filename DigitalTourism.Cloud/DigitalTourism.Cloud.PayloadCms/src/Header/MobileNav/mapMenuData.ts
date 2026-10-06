import type { MainMenu, Page } from '@/payload-types'
import type { MobileMenuLevel } from '@/components/ui/composites/navigation/MobileMenuOverlay'
import type { MobileMenuItem } from '@/components/ui/composites/navigation/MobileMenuList'
import type { DrillDownState } from './useMobileMenuState'

type Tab = NonNullable<MainMenu['tabs']>[number]
type NavItem = NonNullable<Tab['navItems']>[number]

/** Resolve a CMS link to a plain href string (mirrors CMSLink logic). */
function resolveLinkHref(link: {
  type?: 'custom' | 'reference' | null
  url?: string | null
  reference?: {
    relationTo: 'pages'
    value: Page | string | number
  } | null
}): string | undefined {
  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value.slug) {
    const doc = link.reference.value
    if (link.reference.relationTo === 'pages') {
      if ('breadcrumbs' in doc && Array.isArray(doc.breadcrumbs) && doc.breadcrumbs.length > 0) {
        const last = doc.breadcrumbs[doc.breadcrumbs.length - 1]
        if (last?.url) return doc.slug === 'home' ? '/' : last.url
      }
      return doc.slug === 'home' ? '/' : `/${doc.slug}`
    }
    return `/${link.reference.relationTo}/${doc.slug}`
  }
  return link.url ?? undefined
}

export function mapTabsToLevel(
  tabs: MainMenu['tabs'],
  state: DrillDownState,
  callbacks: {
    drillDown: (tabIndex: number) => void
    drillToLinks: (navItemIndex: number) => void
    onNavigate: () => void
    mainMenuLabel: string
  },
): MobileMenuLevel {
  if (!tabs) return { items: [] }

  // Level 1: Show all tabs
  if (state.level === 1) {
    const items: MobileMenuItem[] = tabs.map((tab, index) => {
      const hasDropdown = tab.enableDropdown && tab.navItems && tab.navItems.length > 0

      if (hasDropdown) {
        return {
          label: tab.label,
          hasChildren: true,
          onClick: () => callbacks.drillDown(index),
        }
      }

      // Direct link tab (like "Събития")
      if (tab.enableDirectLink && tab.link) {
        const href = resolveLinkHref(tab.link)
        return {
          label: tab.label,
          href,
          onClick: callbacks.onNavigate,
        }
      }

      return { label: tab.label }
    })

    return { items }
  }

  // Level 2: Show navItems of selected tab
  if (state.level === 2 && state.tabIndex !== null) {
    const tab = tabs[state.tabIndex]
    if (!tab) return { items: [] }

    const items: MobileMenuItem[] = (tab.navItems ?? []).map((navItem: NavItem, index: number) => {
      const hasLinks = navItem.listLinks?.links && navItem.listLinks.links.length > 0
      return {
        label: navItem.listLinks?.tag ?? '',
        hasChildren: !!hasLinks,
        onClick: hasLinks ? () => callbacks.drillToLinks(index) : undefined,
      }
    })

    return {
      title: tab.label,
      backLabel: callbacks.mainMenuLabel,
      items,
    }
  }

  // Level 3: Show links of selected navItem
  if (state.level === 3 && state.tabIndex !== null && state.navItemIndex !== null) {
    const tab = tabs[state.tabIndex]
    const navItem = tab?.navItems?.[state.navItemIndex]
    if (!tab || !navItem) return { items: [] }

    const items: MobileMenuItem[] = (navItem.listLinks?.links ?? []).map((linkItem) => ({
      label: linkItem.link?.label ?? '',
      href: linkItem.link ? resolveLinkHref(linkItem.link) : undefined,
      onClick: callbacks.onNavigate,
    }))

    return {
      title: navItem.listLinks?.tag ?? '',
      backLabel: tab.label,
      items,
    }
  }

  return { items: [] }
}
