import { cn } from '@/components/ui/theme/cn'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const sectionVariants = cva('', {
  defaultVariants: {
    padding: 'md',
  },
  variants: {
    padding: {
      none: '',
      sm: 'py-6 md:py-8',
      md: 'py-10 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-24 md:py-32',
    },
  },
})

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section: React.FC<SectionProps> = ({ className, padding, ...props }) => {
  return <section className={cn(sectionVariants({ padding }), className)} {...props} />
}

export { Section, sectionVariants }
