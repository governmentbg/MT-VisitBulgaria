import React from 'react'
import { cn } from '@/components/ui'

export interface EventInfoCardProps {
  icon: React.ReactNode
  label: string
  value: string
  className?: string
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({
  icon,
  label,
  value,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-3xl bg-white py-4 pl-4 pr-6 shadow-md',
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-heading text-sm text-grey-500">{label}</span>
        <span className="font-heading text-lg font-medium text-grey-900">{value}</span>
      </div>
    </div>
  )
}
