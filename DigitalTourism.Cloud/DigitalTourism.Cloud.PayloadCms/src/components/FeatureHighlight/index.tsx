import React from 'react'
import { cn } from '@/components/ui/theme/cn'
import { Section } from '@/components/ui/layout/Section'
import { Container } from '@/components/ui/layout/Container'
import { LinkButton, type LinkButtonProps } from '@/components/ui/primitives/LinkButton'
import { FeatureHighlightBackground } from './FeatureHighlightBackground'

export interface FeatureHighlightProps {
  heading: string
  description?: React.ReactNode
  buttonLabel?: string
  buttonHref?: string
  buttonVariant?: LinkButtonProps['variant']
  image: React.ReactNode
  imagePosition?: 'left' | 'right'
  showBackground?: boolean
  showDecoration?: boolean
  decorationSrc?: string
  className?: string
  actions?: React.ReactNode
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  heading,
  description,
  buttonLabel,
  buttonHref,
  buttonVariant = 'secondary',
  image,
  imagePosition = 'right',
  showBackground = true,
  showDecoration = false,
  decorationSrc,
  className,
  actions,
}) => {
  const textContent = (
    <div className="flex flex-col justify-center gap-6 md:gap-8">
      <div className="flex flex-col gap-4 md:gap-6">
        <h2 className="font-heading text-3xl font-bold text-grey-900 sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.15]">
          {heading}
        </h2>
        {description && (
          <div className="text-base leading-relaxed text-grey-600">
            {description}
          </div>
        )}
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-4">{actions}</div>
      ) : buttonLabel && buttonHref ? (
        <div className="flex flex-wrap gap-4">
          <LinkButton href={buttonHref} variant={buttonVariant} size="sm">
            {buttonLabel}
          </LinkButton>
        </div>
      ) : null}
    </div>
  )

  const imageContent = (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
      {image}
    </div>
  )

  const isImageLeft = imagePosition === 'left'

  return (
    <Section padding="xl" className={cn('relative', className)}>
      {showBackground && (
        <FeatureHighlightBackground
          showDecoration={showDecoration}
          decorationSrc={decorationSrc}
        />
      )}
      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          {/* On mobile, image always comes first for visual impact */}
          <div className={cn('md:hidden')}>{imageContent}</div>

          {/* Desktop: respect imagePosition */}
          {isImageLeft ? (
            <>
              <div className="hidden md:block">{imageContent}</div>
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              <div className="hidden md:block">{imageContent}</div>
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
