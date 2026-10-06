'use client'

import { useRouter } from '@/i18n/routing'
import { Button, cn } from '@/components/ui'
import { ChevronLeft } from 'lucide-react'

interface BackButtonProps {
  className?: string
  label?: string
  fallbackHref?: string
}

export const BackButton: React.FC<BackButtonProps> = ({
  className,
  label = 'Back',
  fallbackHref,
}) => {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else if (fallbackHref) {
      router.push(fallbackHref)
    } else {
      router.push('/')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={handleBack}
      className={cn(
        'relative z-10 gap-1 cursor-pointer',
        'bg-white/90 dark:bg-black/90 backdrop-blur-sm',
        'text-foreground hover:bg-white dark:hover:bg-black',
        'shadow-sm border border-border/50',
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}
