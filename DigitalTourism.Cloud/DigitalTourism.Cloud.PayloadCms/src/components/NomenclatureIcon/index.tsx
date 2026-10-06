'use client'

import React from 'react'
import { iconMap } from './iconMap'
import { DynamicIcon } from 'lucide-react/dynamic'
import { Square } from 'lucide-react'

interface NomenclatureIconProps {
  iconName?: string | null
  svgContent?: string | null
  size?: number
  className?: string
}

/**
 * Renders a nomenclature icon: Lucide icon by name, or custom SVG markup.
 * Returns null if neither is provided.
 *
 * Environment-based icon loading:
 * - Development: Uses static icon map (38 icons) for fast compilation
 * - Production: Uses DynamicIcon for full flexibility (all 1000+ icons)
 */
export const NomenclatureIcon: React.FC<NomenclatureIconProps> = ({
  iconName,
  svgContent,
  size = 16,
  className,
}) => {
  if (iconName) {
    // In production: use DynamicIcon for full icon set (admins can configure any icon)
    if (process.env.NODE_ENV === 'production') {
      return <DynamicIcon name={iconName as any} size={size} className={className} />
    }

    // In development: use static icon map for fast compilation
    const IconComponent = iconMap[iconName]

    if (!IconComponent) {
      console.warn(
        `[DEV] Icon "${iconName}" not found in static iconMap. ` +
          `Add it to iconMap.ts or it will use DynamicIcon in production.`,
      )
      return <Square size={size} className={className} />;
      
    }

    return <IconComponent size={size} className={className} />
  }

  if (svgContent) {
    return (
      <span
        className={className}
        style={{ width: size, height: size, display: 'inline-flex' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    )
  }

  return null
}
