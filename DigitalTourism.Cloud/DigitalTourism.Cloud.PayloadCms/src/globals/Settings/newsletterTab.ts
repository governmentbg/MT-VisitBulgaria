import { fieldAdminOnly } from '@/access/accessHelpers'
import { settingsLabels, settingsDescriptions } from '@/i18n/admin'

// The Settings global itself is publicly readable (see Settings/config.ts),
// but newsletter provider credentials are secrets. Lock each credential
// field with `access.read: adminOnly` so non-admin callers never receive
// them over REST/GraphQL, even though the rest of Settings is exposed.
const credentialAccess = {
  read: fieldAdminOnly,
}

export const newsletterTab = {
  label: settingsLabels.newsletterTab,
  fields: [
    {
      name: 'newsletterProvider',
      type: 'select' as const,
      label: settingsLabels.newsletterProvider,
      defaultValue: 'database',
      options: [
        { label: { en: 'Local Database', bg: 'Локална база данни' }, value: 'database' },
        { label: 'Mailchimp', value: 'mailchimp' },
        { label: 'Brevo', value: 'brevo' },
        { label: 'MailerLite', value: 'mailerlite' },
      ],
      admin: {
        description: settingsDescriptions.newsletterProvider,
      },
    },
    // Loading wrapper for provider transition
    {
      name: 'providerFieldsWrapper',
      type: 'ui' as const,
      admin: {
        components: {
          Field: '@/globals/Settings/components/NewsletterProviderFields#NewsletterProviderFields',
        },
      },
    },
    // Mailchimp
    {
      name: 'mailchimpApiKey',
      type: 'text' as const,
      label: settingsLabels.mailchimpApiKey,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'mailchimp',
        description: settingsDescriptions.mailchimpApiKey,
      },
    },
    {
      name: 'mailchimpAudienceId',
      type: 'text' as const,
      label: settingsLabels.mailchimpAudienceId,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'mailchimp',
        components: {
          Field: '@/globals/Settings/components/ProviderListSelect#ProviderListSelect',
        },
        custom: {
          providerName: 'mailchimp',
          apiKeyFieldName: 'mailchimpApiKey',
          emptyLabel: 'Select audience...',
        },
        description: settingsDescriptions.mailchimpAudienceId,
      },
    },
    // Brevo
    {
      name: 'brevoApiKey',
      type: 'text' as const,
      label: settingsLabels.brevoApiKey,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'brevo',
        description: settingsDescriptions.brevoApiKey,
      },
    },
    {
      name: 'brevoListId',
      type: 'text' as const,
      label: settingsLabels.brevoListId,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'brevo',
        components: {
          Field: '@/globals/Settings/components/ProviderListSelect#ProviderListSelect',
        },
        custom: {
          providerName: 'brevo',
          apiKeyFieldName: 'brevoApiKey',
          emptyLabel: 'Select list...',
        },
        description: settingsDescriptions.brevoListId,
      },
    },
    // MailerLite
    {
      name: 'mailerliteApiToken',
      type: 'text' as const,
      label: settingsLabels.mailerliteApiToken,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'mailerlite',
        description: settingsDescriptions.mailerliteApiToken,
      },
    },
    {
      name: 'mailerliteGroupId',
      type: 'text' as const,
      label: settingsLabels.mailerliteGroupId,
      access: credentialAccess,
      admin: {
        condition: (data: any) => data?.newsletterProvider === 'mailerlite',
        components: {
          Field: '@/globals/Settings/components/ProviderListSelect#ProviderListSelect',
        },
        custom: {
          providerName: 'mailerlite',
          apiKeyFieldName: 'mailerliteApiToken',
          emptyLabel: 'Select group...',
        },
        description: settingsDescriptions.mailerliteGroupId,
      },
    },
  ],
}
