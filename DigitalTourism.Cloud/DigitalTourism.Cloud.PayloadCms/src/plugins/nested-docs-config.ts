import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

/**
 * Note: Localized required fields (title, content) use custom validators
 * (localizedRequired*) that only enforce "required" for the default locale.
 * This allows the plugin's `resaveChildren` to update breadcrumbs on
 * untranslated children without hitting validation errors.
 */
export const nestedDocs = nestedDocsPlugin({
  collections: ['categories', 'pages'],
  generateURL: (docs) =>
    docs.reduce((url, doc) => {
      // When slug is localized, it may be undefined for untranslated locales.
      // Fall back to empty string to avoid "/undefined/" in breadcrumb URLs.
      const slug = doc.slug || ''
      return slug ? `${url}/${slug}` : url
    }, ''),
})
