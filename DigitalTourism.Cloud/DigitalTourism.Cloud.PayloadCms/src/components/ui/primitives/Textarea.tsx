import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

const Textarea: React.FC<
  {
    ref?: React.Ref<HTMLTextAreaElement>
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[120px] w-full rounded-xl border border-input-field-border bg-background p-4 text-sm font-sans font-medium placeholder:text-input-field-placeholder hover:border-grey-300 focus:outline-none focus:shadow-[0px_0px_4px_1px] focus:shadow-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 group-data-[error]/field:border-destructive',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
