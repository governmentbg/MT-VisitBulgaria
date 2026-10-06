import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (
          richText && (
            <RichText
              className="[&_h1]:font-heading [&_h1]:font-bold
                [&_h1]:text-[1.75rem] [&_h1]:leading-tight
                [&_h1]:md:text-[2.5rem]
                [&_h1]:lg:text-[3.75rem] [&_h1]:lg:leading-[1.1]
                [&_h2]:font-heading [&_h2]:font-bold"
              data={richText}
              enableGutter={false}
            />
          )
        )}
      </div>
    </div>
  )
}
