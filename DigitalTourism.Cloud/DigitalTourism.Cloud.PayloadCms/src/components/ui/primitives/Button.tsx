import { cn } from '@/components/ui/theme/cn'
import { SpriteIcon } from '@/components/ui/SpriteIcon'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-bold font-sans leading-[1.4] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
    variants: {
      size: {
        xs: 'gap-2 px-7 py-3.5 text-sm [&_svg]:h-4 [&_svg]:w-4',
        sm: 'gap-2 px-7 py-[18px] text-sm [&_svg]:h-4 [&_svg]:w-4',
        md: 'gap-3 px-8 py-[21px] text-base [&_svg]:h-5 [&_svg]:w-5',
        lg: 'gap-4 px-10 py-6 text-lg [&_svg]:h-6 [&_svg]:w-6',
        icon: 'p-4 [&_svg]:h-6 [&_svg]:w-6',
        // Backwards-compatible aliases
        default: 'gap-3 px-8 py-[21px] text-base [&_svg]:h-4 [&_svg]:w-4',
        clear: '',
      },
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-600',
        secondary:
          'bg-grey-50 text-grey-900 hover:bg-primary-50 hover:text-primary-900',
        tertiary:
          'bg-transparent text-grey-900 underline underline-offset-4 hover:text-primary',
        dark:
          'bg-button-primary text-white hover:bg-button-primary-hover',
        destructive:
          'bg-error-100 text-white hover:bg-error-200',
        link: 'text-primary items-start justify-start underline-offset-4 hover:underline rounded-none',
        // Backwards-compatible aliases for old variant names
        default:
          'bg-primary text-white hover:bg-primary-600',
        outline:
          'bg-grey-50 text-grey-900 hover:bg-primary-50 hover:text-primary-900',
        ghost:
          'bg-transparent text-grey-900 underline underline-offset-4 hover:text-primary',
      },
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  iconOnly?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

const iconOnlySize = {
  xs: 'p-3',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
} as const

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  size,
  variant,
  icon = <SpriteIcon name="arrow-up-right" />,
  iconOnly,
  ref,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : 'button'

  if (iconOnly && icon) {
    const pad = iconOnlySize[(size as keyof typeof iconOnlySize) ?? 'md'] ?? iconOnlySize.md
    return (
      <Comp
        className={cn(buttonVariants({ className, size: 'icon', variant }), pad)}
        ref={ref}
        {...props}
      >
        {icon}
      </Comp>
    )
  }

  if (asChild) {
    return (
      <Slot className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <button className={cn(buttonVariants({ className, size, variant }))} ref={ref} {...props}>
      {children}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  )
}

export { Button, buttonVariants }
