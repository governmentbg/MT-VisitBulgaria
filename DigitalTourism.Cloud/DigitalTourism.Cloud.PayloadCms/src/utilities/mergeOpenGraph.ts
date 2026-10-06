import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultDescription =
  'Travel to Bulgaria and discover the best destinations, cultural landmarks, and nature experiences. Your complete tourism guide is here.'
const defaultSiteName = 'Visit Bulgaria'
const defaultTitle = 'Travel to Bulgaria – Your Complete Official Tourism Guide'

type OpenGraphDefaults = {
  siteName?: string
  title?: string
  description?: string
}

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  defaults?: OpenGraphDefaults,
): Metadata['openGraph'] => {
  const base: Metadata['openGraph'] = {
    type: 'website',
    description: defaults?.description || defaultDescription,
    images: [
      {
        url: `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName: defaults?.siteName || defaultSiteName,
    title: defaults?.title || defaultTitle,
  }

  return {
    ...base,
    ...og,
    images: og?.images ? og.images : base.images,
  }
}
