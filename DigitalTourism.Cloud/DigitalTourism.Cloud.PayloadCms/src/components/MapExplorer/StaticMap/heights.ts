/**
 * Height classes for the map block.
 *
 * Deliberately kept in its own leaflet-free module: the block's client
 * component needs these values on the server, and importing them from
 * StaticMapClient pulls react-leaflet — and therefore leaflet, which touches
 * `window` at module scope — into the SSR graph, even though the map itself is
 * loaded with `dynamic(..., { ssr: false })`.
 *
 * Compact fixed heights on phones; the dvh height the editor picked applies from md up.
 */
export const HEIGHT_CLASSES = {
  sm: 'h-[220px] md:h-[30dvh]',
  md: 'h-[240px] md:h-[45dvh]',
  lg: 'h-[260px] md:h-[60dvh]',
} as const

export type MapHeight = keyof typeof HEIGHT_CLASSES
