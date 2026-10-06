import { cn } from '@/components/ui'
import React from 'react'

interface FooterCreditsProps {
  className?: string
  copyrightText: string
}

export const FooterCredits: React.FC<FooterCreditsProps> = ({ className, copyrightText }) => (
  <div className={cn('border-t border-white/20 pt-8', className)}>
    <p className="text-sm font-bold text-white">{copyrightText}</p>
  </div>
)
