import { localizationEnhancementPlugin } from './localization-enhancement'

export const localizationEnhancement = localizationEnhancementPlugin({
  exclude: ['media', 'users', 'workflow-history'],
})
