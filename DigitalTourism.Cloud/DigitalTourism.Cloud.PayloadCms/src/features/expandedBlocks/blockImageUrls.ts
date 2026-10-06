/**
 * SVG data URI thumbnails for the block picker dropdown.
 * Uses 24x24 viewBox matching Lucide icon dimensions so they render
 * crisply at the toolbar's native icon size.
 *
 * Icon SVG paths are extracted from Lucide icons (https://lucide.dev).
 */

function makeBlockImageUrl(paths: string, color = '#475569'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// Lucide icon paths
export const blockImageUrls: Record<string, string> = {
  // Content group
  content: makeBlockImageUrl(
    '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  ), // FileText
  mediaBlock: makeBlockImageUrl(
    '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  ), // Image
  masonryGallery: makeBlockImageUrl(
    '<path d="M18 22H4a2 2 0 0 1-2-2V6"/><rect width="16" height="16" x="6" y="2" rx="2"/><circle cx="14" cy="8" r="2"/><path d="m20 14-2.05-2.05a2 2 0 0 0-2.83 0L10 17"/>',
  ), // Images
  featureSection: makeBlockImageUrl(
    '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  ), // LayoutDashboard
  featureHighlight: makeBlockImageUrl(
    '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  ), // Sparkles
  banner: makeBlockImageUrl(
    '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  ), // Flag
  learnMore: makeBlockImageUrl(
    '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/>',
  ), // BookOpen

  // Layout group
  spacerBlock: makeBlockImageUrl(
    '<line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="18" y2="18"/>',
  ), // SeparatorHorizontal
  columns: makeBlockImageUrl(
    '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/>',
  ), // Columns3
  fullWidthCta: makeBlockImageUrl(
    '<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  ), // Megaphone
  cta: makeBlockImageUrl(
    '<path d="M9 9h.01"/><path d="m15 9-.01 0"/><path d="M8 13a4 4 0 0 0 8 0"/><circle cx="12" cy="12" r="10"/>',
  ), // MousePointerClick

  // Data & Listings group
  experienceListing: makeBlockImageUrl(
    '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  ), // LayoutGrid
  pagesBlock: makeBlockImageUrl(
    '<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/>',
  ), // Files
  factsListing: makeBlockImageUrl(
    '<path d="M11 18H3"/><path d="m15 18 2 2 4-4"/><path d="M16 12H3"/><path d="M16 6H3"/>',
  ), // ListChecks
  iconCards: makeBlockImageUrl(
    '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  ), // CreditCard
  statisticsBanner: makeBlockImageUrl(
    '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  ), // TrendingUp
  stats: makeBlockImageUrl(
    '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  ), // BarChart3
  faqAccordion: makeBlockImageUrl(
    '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  ), // HelpCircle
  eventSearch: makeBlockImageUrl(
    '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  ), // Search
  featuredEvents: makeBlockImageUrl(
    '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  ), // Star

  // Maps & Location group
  svgMap: makeBlockImageUrl(
    '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
  ), // Map
  mapExplorer: makeBlockImageUrl(
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  ), // MapPin

  // Forms group
  formBlock: makeBlockImageUrl(
    '<path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/>',
  ), // FileInput

  // Deprecated
  archive: makeBlockImageUrl(
    '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  ), // Archive
}
