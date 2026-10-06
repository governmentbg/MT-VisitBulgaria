import type { GlobalConfig } from 'payload'

import { curatorOrAdmin, hiddenFromNonCurator } from '@/access/accessHelpers'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { globalLabels, footerLabels, adminGroupLabels } from '@/i18n/admin'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: globalLabels.footer.label,
  access: {
    read: () => true,
    update: curatorOrAdmin,
  },
  admin: {
    group: adminGroupLabels.content,
    hidden: hiddenFromNonCurator,
  },
  fields: [
    {
      name: '_resolved',
      type: 'json',
      admin: { hidden: true, readOnly: true, disableBulkEdit: true },
    },
    {
      name: 'navItems',
      type: 'array',
      label: footerLabels.navItems,
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'linkGroups',
      type: 'array',
      label: footerLabels.linkGroups,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: footerLabels.groupTitle,
        },
        {
          name: 'links',
          type: 'array',
          label: footerLabels.groupLinks,
          maxRows: 8,
          fields: [
            link({
              appearances: false,
            }),
          ],
          admin: {
            initCollapsed: true,
          },
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: footerLabels.socialLinks,
      maxRows: 5,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: footerLabels.socialUrl,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
          label: footerLabels.socialLabel,
        },
      ],
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'newsletterHeadline',
      type: 'text',
      localized: true,
      label: footerLabels.newsletterHeadline,
    },
    {
      name: 'newsletterSubtitle',
      type: 'text',
      localized: true,
      label: footerLabels.newsletterSubtitle,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
