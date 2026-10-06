import type { LocalizedLabel } from '../types'

/**
 * Settings global field labels
 */
export const settingsLabels: Record<string, LocalizedLabel> = {
  pagesTab: { en: 'Pages', bg: 'Страници' },
  siteIdentityTab: { en: 'Site Identity', bg: 'Идентичност на сайта' },
  mapTab: { en: 'Map', bg: 'Карта' },
  filtersTab: { en: 'Filters', bg: 'Филтри' },
  homePage: { en: 'Home Page', bg: 'Начална страница' },
  termsOfConditionsPage: { en: 'Terms & Conditions Page', bg: 'Страница с общи условия' },
  privacyPolicyPage: { en: 'Privacy Policy Page', bg: 'Страница за поверителност' },
  businessTermsPage: { en: 'Business Terms Page', bg: 'Страница с бизнес условия' },
  siteName: { en: 'Site Name', bg: 'Име на сайта' },
  siteTagline: { en: 'Site Tagline', bg: 'Слоган на сайта' },
  defaultMetaDescription: { en: 'Default Meta Description', bg: 'Мета описание по подразбиране' },
  mapMaxCityMarkers: { en: 'Max City Markers', bg: 'Макс. маркери за градове' },
  mapMaxExperienceMarkers: { en: 'Max Experience Markers', bg: 'Макс. маркери за обекти' },
  mapZoomThreshold: { en: 'Zoom Threshold', bg: 'Праг на мащабиране' },
  facetConfig: { en: 'Facet Filters', bg: 'Фасетни филтри' },
  facetKey: { en: 'Facet', bg: 'Фасет' },
  facetEnabled: { en: 'Enabled', bg: 'Активен' },
  facetDefaultExpanded: { en: 'Expanded by Default', bg: 'Разгънат по подразбиране' },
  facetMaxVisible: { en: 'Max Visible Items', bg: 'Макс. видими елементи' },
  facetSortOrder: { en: 'Sort Order', bg: 'Подредба' },
  facetSelectionMode: { en: 'Selection Mode', bg: 'Режим на избор' },
  facetFilterMode: { en: 'Filter Logic', bg: 'Логика на филтъра' },
  workflowTab: { en: 'Workflow', bg: 'Работен поток' },
  requireAllTranslations: { en: 'Require All Translations', bg: 'Изискване на всички преводи' },
  accessTab: { en: 'Access', bg: 'Достъп' },
  sitePasswordEnabled: { en: 'Password-Protect Website', bg: 'Защита на сайта с парола' },
  sitePassword: { en: 'Site Password', bg: 'Парола за сайта' },
  allowCrawlerIndexing: { en: 'Allow Search Engine Indexing', bg: 'Разрешаване на индексиране от търсачки' },
  newsletterTab: { en: 'Newsletter', bg: 'Бюлетин' },
  newsletterProvider: { en: 'Newsletter Provider', bg: 'Доставчик на бюлетин' },
  mailchimpApiKey: { en: 'Mailchimp API Key', bg: 'Mailchimp API ключ' },
  mailchimpAudienceId: { en: 'Audience ID', bg: 'ID на аудитория' },
  brevoApiKey: { en: 'Brevo API Key', bg: 'Brevo API ключ' },
  brevoListId: { en: 'List ID', bg: 'ID на списък' },
  mailerliteApiToken: { en: 'MailerLite API Token', bg: 'MailerLite API токен' },
  mailerliteGroupId: { en: 'Group ID', bg: 'ID на група' },
}

/**
 * Settings global field descriptions
 */
export const settingsDescriptions: Record<string, LocalizedLabel> = {
  homePage: {
    en: 'Select the page that will be used as the home page',
    bg: 'Изберете страницата, която ще се използва като начална страница',
  },
  termsOfConditionsPage: {
    en: 'Select the page that contains terms and conditions',
    bg: 'Изберете страницата, която съдържа общите условия',
  },
  privacyPolicyPage: {
    en: 'Select the page that contains the privacy policy',
    bg: 'Изберете страницата, която съдържа политиката за поверителност',
  },
  businessTermsPage: {
    en: 'Select the page that contains the business terms for business owners',
    bg: 'Изберете страницата, която съдържа бизнес условията за собственици на бизнес',
  },
  siteName: {
    en: 'The name of your website',
    bg: 'Името на вашия уебсайт',
  },
  siteTagline: {
    en: 'A short tagline or description of your website',
    bg: 'Кратък слоган или описание на вашия уебсайт',
  },
  defaultMetaDescription: {
    en: 'Default meta description used when pages do not have their own',
    bg: 'Мета описание по подразбиране, използвано когато страниците нямат собствено',
  },
  mapMaxCityMarkers: {
    en: 'Maximum number of city cluster markers shown at country zoom level',
    bg: 'Максимален брой маркери за градове на ниво държава',
  },
  mapMaxExperienceMarkers: {
    en: 'Maximum number of individual experience markers shown at city zoom level',
    bg: 'Максимален брой маркери за обекти на ниво град',
  },
  mapZoomThreshold: {
    en: 'Zoom level at which the map switches from city clusters to individual markers',
    bg: 'Ниво на мащабиране, при което картата превключва от групи градове към отделни маркери',
  },
  facetConfig: {
    en: 'Configure which facet filters are shown in listing pages and how they behave. Drag to reorder.',
    bg: 'Конфигурирайте кои фасетни филтри се показват в страниците с листинги и как се държат. Плъзнете за пренареждане.',
  },
  facetMaxVisible: {
    en: 'Number of items shown before "Show more" toggle. Leave empty to show all.',
    bg: 'Брой елементи, показани преди бутона "Покажи още". Оставете празно за показване на всички.',
  },
  facetSortOrder: {
    en: 'Lower numbers appear first. Facets with the same order follow their default sequence.',
    bg: 'По-ниските числа се показват първи. Фасети с еднакъв ред следват подреждането по подразбиране.',
  },
  facetSelectionMode: {
    en: 'Multi-select allows checking multiple values. Single-select allows only one.',
    bg: 'Множественият избор позволява маркиране на няколко стойности. Единичният избор позволява само една.',
  },
  facetFilterMode: {
    en: 'OR: matches any selected value. AND: must match all selected values.',
    bg: 'ИЛИ: съвпада с поне една стойност. И: трябва да съвпада с всички избрани стойности.',
  },
  requireAllTranslations: {
    en: 'When enabled, all locale translations must be completed before a document can be submitted for review',
    bg: 'Когато е включено, всички преводи трябва да бъдат завършени преди документът да може да бъде изпратен за преглед',
  },
  sitePasswordEnabled: {
    en: 'When enabled, visitors must enter a password to access the public website. The admin panel remains accessible.',
    bg: 'Когато е включено, посетителите трябва да въведат парола за достъп до публичния уебсайт. Административният панел остава достъпен.',
  },
  sitePassword: {
    en: 'The password visitors must enter to access the site. Stored securely (hashed).',
    bg: 'Паролата, която посетителите трябва да въведат за достъп до сайта. Съхранява се сигурно (хеширана).',
  },
  allowCrawlerIndexing: {
    en: 'When enabled, search engines will be allowed to index the site. When disabled, noindex/nofollow meta tags are added.',
    bg: 'Когато е включено, търсачките ще могат да индексират сайта. Когато е изключено, се добавят noindex/nofollow мета тагове.',
  },
  newsletterProvider: {
    en: 'Choose where new newsletter subscriptions are sent. "Local Database" stores them only in the CMS database.',
    bg: 'Изберете къде да се изпращат новите абонаменти за бюлетин. "Локална база данни" ги съхранява само в базата на CMS.',
  },
  mailchimpApiKey: {
    en: 'Found in Account → Extras → API keys. Includes the data center suffix (e.g. abc123-us21).',
    bg: 'Намира се в Account → Extras → API keys. Включва суфикса на центъра за данни (напр. abc123-us21).',
  },
  mailchimpAudienceId: {
    en: 'The unique ID of the Mailchimp audience/list to add subscribers to. Found in Audience → Settings → Audience name and defaults.',
    bg: 'Уникалният ID на аудиторията/списъка в Mailchimp. Намира се в Audience → Settings → Audience name and defaults.',
  },
  brevoApiKey: {
    en: 'Found in Settings → SMTP & API → API keys & MCP tab. Click "Generate a new API key" if none exist.',
    bg: 'Намира се в Settings → SMTP & API → раздел API keys & MCP. Натиснете "Generate a new API key", ако няма създаден.',
  },
  brevoListId: {
    en: 'Optional. The numeric ID of the contact list. Found in Contacts → Lists.',
    bg: 'По избор. Числовият ID на списъка с контакти. Намира се в Contacts → Lists.',
  },
  mailerliteApiToken: {
    en: 'Generated in Integrations → MailerLite API → Generate new token.',
    bg: 'Генерира се в Integrations → MailerLite API → Generate new token.',
  },
  mailerliteGroupId: {
    en: 'Optional. The ID of the subscriber group. Found in Integrations → MailerLite API → Groups.',
    bg: 'По избор. ID на групата абонати. Намира се в Integrations → MailerLite API → Groups.',
  },
}
