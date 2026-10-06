'use client'

import { PersonRegular } from '@/components/ui/icons'
import { cn } from '@/components/ui/theme/cn'
import { useTranslations } from 'next-intl'

export type LoginButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const LoginButton: React.FC<LoginButtonProps> = ({ className, children, ...props }) => {
  const t = useTranslations('common')

  return (
    <button
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full transition-colors',
        'bg-grey-100 text-grey-600 hover:bg-grey-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
      aria-label={children as string ?? t('login')}
      {...props}
    >
      <PersonRegular className="size-5 stroke-current stroke-[0.5px]" />
    </button>
  )
}
