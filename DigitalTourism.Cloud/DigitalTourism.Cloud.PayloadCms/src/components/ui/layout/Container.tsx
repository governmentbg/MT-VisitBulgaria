import { cn } from '@/components/ui/theme/cn'
import * as React from 'react'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

const Container: React.FC<ContainerProps> = ({ as: Component = 'div', className, ...props }) => {
  return <Component className={cn('container', className)} {...props} />
}

export { Container }
