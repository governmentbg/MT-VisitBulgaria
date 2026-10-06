import type { StaticImageData } from 'next/image'
import type { ElementType, Ref } from 'react'

import type { Media as MediaType } from '@/payload-types'

// Available prerendered image sizes from Payload
export type PayloadImageSize =
  | 'thumbnail'
  | 'square'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'og'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  htmlElement?: ElementType | null
  pictureClassName?: string
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  loading?: 'lazy' | 'eager' // for NextImage only
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: MediaType | string | number | null // for Payload media
  size?: string // for NextImage only
  src?: StaticImageData // for static media
  videoClassName?: string
  // Use Payload prerendered sizes instead of Next.js dynamic sizing
  usePayloadSizes?: boolean
  // Preferred size to display (uses srcset for responsive)
  preferredSize?: PayloadImageSize
  // Cap image resolution on mobile viewports (≤768px) to this Payload size.
  // Prevents high-DPR phones from downloading unnecessarily large images.
  mobileMaxSize?: PayloadImageSize
}
