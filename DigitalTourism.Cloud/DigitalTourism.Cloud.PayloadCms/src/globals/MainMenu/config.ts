import type { GlobalConfig } from 'payload'

import { curatorOrAdmin, hiddenFromNonCurator } from '@/access/accessHelpers'
import { link } from '@/fields/link'
import { globalLabels, mainMenuLabels, mainMenuDescriptions, dropdownTypeOptions, adminGroupLabels } from '@/i18n/admin'
import { revalidateMainMenu } from './hooks/revalidateMainMenu'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: globalLabels.mainMenu.label,
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
      name: 'tabs',
      type: 'array',
      label: mainMenuLabels.tabs,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/globals/MainMenu/RowLabel#RowLabel',
        },
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: mainMenuLabels.label,
          required: true,
          localized: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'enableDirectLink',
              type: 'checkbox',
              label: mainMenuLabels.enableDirectLink,
              admin: {
                description: mainMenuDescriptions.enableDirectLink,
                width: '50%',
              },
            },
            {
              name: 'enableDropdown',
              type: 'checkbox',
              label: mainMenuLabels.enableDropdown,
              admin: {
                description: mainMenuDescriptions.enableDropdown,
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'collapsible',
          label: mainMenuLabels.directLink,
          admin: {
            condition: (_, siblingData) => siblingData.enableDirectLink,
          },
          fields: [
            link({
              appearances: false,
              disableLabel: true,
            }),
          ],
        },
        {
          type: 'collapsible',
          label: mainMenuLabels.dropdownMenu,
          admin: {
            condition: (_, siblingData) => siblingData.enableDropdown,
          },
          fields: [
            {
              name: 'description',
              type: 'textarea',
              label: mainMenuLabels.description,
              localized: true,
              admin: {
                description: mainMenuDescriptions.description,
              },
            },
            {
              name: 'dropdownType',
              type: 'select',
              label: mainMenuLabels.dropdownType,
              defaultValue: 'info',
              options: dropdownTypeOptions,
              admin: {
                description: mainMenuDescriptions.dropdownType,
              },
            },
            {
              name: 'navItems',
              type: 'array',
              label: mainMenuLabels.navItems,
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'listLinks',
                  type: 'group',
                  label: mainMenuLabels.listLinks,
                  fields: [
                    {
                      name: 'tag',
                      type: 'text',
                      label: mainMenuLabels.tag,
                      localized: true,
                    },
                    {
                      name: 'links',
                      type: 'array',
                      label: mainMenuLabels.links,
                      fields: [
                        link({
                          appearances: false,
                        }),
                        {
                          name: 'image',
                          type: 'upload',
                          relationTo: 'media',
                          admin: {
                            description: mainMenuDescriptions.navImage,
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateMainMenu],
  },
}
