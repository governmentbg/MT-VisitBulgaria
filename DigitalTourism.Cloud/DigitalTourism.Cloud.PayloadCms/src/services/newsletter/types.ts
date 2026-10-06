export interface ListOption {
  label: string
  value: string
}

export interface NewsletterProviderConfig {
  provider: 'database' | 'mailchimp' | 'brevo' | 'mailerlite'
  mailchimpApiKey?: string | null
  mailchimpAudienceId?: string | null
  brevoApiKey?: string | null
  brevoListId?: string | number | null
  mailerliteApiToken?: string | null
  mailerliteGroupId?: string | null
}

export interface NewsletterProvider {
  subscribe(email: string, locale: string, source: string): Promise<void>
  unsubscribe?(email: string): Promise<void>
}
