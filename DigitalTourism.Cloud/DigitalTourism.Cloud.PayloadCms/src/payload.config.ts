import { postgresAdapter } from '@payloadcms/db-postgres'
import { translations } from '@payloadcms/translations/all'
const { en, bg } = translations
import sharp from 'sharp'
import { customTranslations } from './i18n/custom-translations'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Cities } from './collections/Cities'
import { Hotels } from './collections/Experiences/Hotels'
import { Restaurants } from './collections/Experiences/Restaurants'
import { Activities } from './collections/Experiences/Activities'
import { Attractions } from './collections/Experiences/Attractions'
import { Events } from './collections/Experiences/Events'
import { Amenities, CuisineTypes, DietaryOptions, Seasons, DifficultyLevels } from './collections/Nomenclature'
import { Media } from './collections/Media'
import { Municipalities } from './collections/Municipalities'
import { Pages } from './collections/Pages'
import { Regions } from './collections/Regions'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Visitors } from './collections/Visitors'
import { Favorites } from './collections/Favorites'
import { Trips } from './collections/Trips'
import { NewsletterSubscriptions } from './collections/NewsletterSubscriptions/index'
import { Footer } from './Footer/config'
import { MainMenu } from './globals/MainMenu/config'
import { Settings } from './globals/Settings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import localization from './i18n/localization'
import { TOOLKIT_ROUTE } from './components/admin/ToolkitView/constants'
import { regenerateMediaSizesEndpoint } from './endpoints/regenerateMediaSizes'
import { purgeRedisCacheEndpoint } from './endpoints/purgeRedisCache'
import { newsletterSubscribeEndpoint } from './endpoints/newsletterSubscribe'
import { exportNewsletterSubscriptionsEndpoint } from './endpoints/exportNewsletterSubscriptions'
import { newsletterProviderListsEndpoint } from './endpoints/newsletterProviderLists'
import { verifySitePasswordEndpoint } from './endpoints/verifySitePassword'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  i18n: {
    supportedLanguages: {
      en,
      bg,
    },
    translations: customTranslations,
    fallbackLanguage: 'en',
  },
  admin: {
    meta: {
      titleSuffix: ' — Visit Bulgaria CMS',
      icons: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    },
    avatar: {
      Component: '@/components/admin/HiddenAvatar',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/AdminLogo',
        Icon: '@/components/admin/AdminIcon',
      },
      beforeLogin: ['@/components/BeforeLogin'],
      providers: ['@/components/admin/SidebarIcons#SidebarIcons'],
      // Locale selector and profile dropdown in header actions
      actions: [
        '@/components/admin/ProfileDropdown#ProfileDropdown',
        '@/components/admin/Localizer#Localizer',
        '@/components/admin/KeyboardNav#KeyboardNav',
      ],
      logout: {
        Button: '@/components/admin/LogoutButton#LogoutButton',
      },
      views: {
        account: {
          Component: '@/components/admin/AccountView#AccountView',
        },
        analytics: {
          Component: '@/components/admin/AnalyticsView',
          path: '/analytics',
        },
        toolkit: {
          Component: '@/components/admin/ToolkitView',
          path: TOOLKIT_ROUTE,
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  folders: {
    browseByFolder: false,
  },
  localization,
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 50,
      options: '-c plan_cache_mode=force_generic_plan',
    },    
    push: false,
  }),
  collections: [
    Pages,
    Hotels,
    Restaurants,
    Activities,
    Attractions,
    Events,
    Media,
    Categories,
    Tags,
    Regions,
    Municipalities,
    Cities,
    Users,
    Visitors,
    Favorites,
    Trips,
    NewsletterSubscriptions,
    Amenities,
    CuisineTypes,
    DietaryOptions,
    Seasons,
    DifficultyLevels,
  ],
  endpoints: [
    regenerateMediaSizesEndpoint,
    purgeRedisCacheEndpoint,
    newsletterSubscribeEndpoint,
    exportNewsletterSubscriptionsEndpoint,
    newsletterProviderListsEndpoint,
    verifySitePasswordEndpoint
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Footer, MainMenu, Settings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  upload: {
    limits: {
      fileSize: 100000000, // 5MB, written in bytes
    },
  },
  telemetry: false,
})
