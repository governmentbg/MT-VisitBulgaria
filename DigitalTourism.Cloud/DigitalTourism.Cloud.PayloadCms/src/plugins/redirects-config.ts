import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'

export const redirects = redirectsPlugin({
  collections: ['pages'],
  overrides: {
    admin: {
      hidden: true,
    },
    hooks: {
      afterChange: [revalidateRedirects],
    },
  },
})
