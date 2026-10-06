import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

export type SpriteIconName =
  | 'heart-regular'
  | 'heart-filled'
  | 'arrow-up-right'
  | 'location'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'search'
  | 'star-filled'
  | 'map'

export interface SpriteIconProps extends React.SVGAttributes<SVGSVGElement> {
  name: SpriteIconName
}

/**
 * Lightweight icon component that references a <symbol> from the IconSprite.
 * Renders ~50 bytes of HTML instead of ~1 KB per inline Fluent UI icon.
 */
const SpriteIcon: React.FC<SpriteIconProps> = ({ name, className, style: _style, ...props }) => (
  <svg
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    className={cn('fui-Icon', className)}
    fill="currentColor"
    aria-hidden="true"
    
    {...props}
  >
    <use href={`#sprite-${name}`} />
  </svg>
)

export { SpriteIcon }
