import { cn } from '@/components/ui/theme/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const stackVariants = cva('flex', {
  defaultVariants: {
    align: 'stretch',
    direction: 'column',
    gap: 'md',
    justify: 'start',
  },
  variants: {
    align: {
      baseline: 'items-baseline',
      center: 'items-center',
      end: 'items-end',
      start: 'items-start',
      stretch: 'items-stretch',
    },
    direction: {
      column: 'flex-col',
      'column-reverse': 'flex-col-reverse',
      row: 'flex-row',
      'row-reverse': 'flex-row-reverse',
    },
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    justify: {
      around: 'justify-around',
      between: 'justify-between',
      center: 'justify-center',
      end: 'justify-end',
      evenly: 'justify-evenly',
      start: 'justify-start',
    },
    wrap: {
      true: 'flex-wrap',
    },
  },
})

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType
}

const Stack: React.FC<StackProps> = ({
  as: Component = 'div',
  align,
  className,
  direction,
  gap,
  justify,
  wrap,
  ...props
}) => {
  return (
    <Component
      className={cn(stackVariants({ align, direction, gap, justify, wrap }), className)}
      {...props}
    />
  )
}

export { Stack, stackVariants }
