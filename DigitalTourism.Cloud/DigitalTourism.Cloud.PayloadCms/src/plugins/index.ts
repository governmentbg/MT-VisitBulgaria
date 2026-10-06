import type { Plugin } from 'payload'
import { redirects } from './redirects-config'
import { nestedDocs } from './nested-docs-config'
import { seo } from './seo-config'
import { formBuilder } from './form-builder-conifg'
import { typesense } from './typesense-config'
import { weather } from './weather-config'
import { sidebar } from './sidebar-config'
import { experienceListing } from './experience-listing-config'
import { localizationEnhancement } from './localization-enhancement-config'

export const plugins: Plugin[] = [redirects, nestedDocs, seo, formBuilder, typesense, weather, sidebar, experienceListing, localizationEnhancement].filter(
  (plugin): plugin is Plugin => plugin !== null,
)
