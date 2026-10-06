import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  ref?: React.Ref<HTMLInputElement>
}

const Input: React.FC<InputProps> = ({ type, className, leftIcon, rightIcon, ref, ...props }) => (
  <div className="relative flex items-center">
    {leftIcon && (
      <span className="absolute left-4 flex items-center text-grey-400 [&_svg]:h-4 [&_svg]:w-4">
        {leftIcon}
      </span>
    )}
    <input
      className={cn(
        'flex w-full rounded-xl border border-input-field-border bg-background p-4 text-sm font-sans font-medium placeholder:text-input-field-placeholder hover:border-grey-300 focus:outline-none focus:shadow-[0px_0px_4px_1px] focus:shadow-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium group-data-[error]/field:border-destructive',
        leftIcon && 'pl-11',
        rightIcon && 'pr-11',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
    {rightIcon && (
      <span className="absolute right-4 flex items-center text-grey-400 [&_svg]:h-4 [&_svg]:w-4">
        {rightIcon}
      </span>
    )}
  </div>
)

export { Input }
